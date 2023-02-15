import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from '../sortable.directive';
import { Book, InventoryEntry } from './book';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Borrower, Keyword } from './base-data';

const host = '/api/v1';
const BOOKS_URL = host + '/inventoryController';
const BORROWING_URL = host + '/borrowingProcessController';
interface SearchResult {
    books: Book[];
    total: number;
}

interface State {
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

// Generic compare function
const compare = (v1, v2) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

// Function that sorts the books
function sort(books: Book[], column: SortColumn, direction: string): Book[] {
    if (direction === '' || column === '') {
        return books;
    } else {
        return [...books].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

// Function that matches the search term
function matches(book: Book, text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return (
        book.nakId?.toLowerCase().includes(term) ||
        book.keywords?.some((keyword: Keyword) =>
            keyword.keyword?.toLowerCase().includes(term)
        ) ||
        book.publicationType?.type?.toLowerCase().includes(term) ||
        book.title?.toLowerCase().includes(term) ||
        book.authors?.toLowerCase().includes(term) ||
        book.publisher?.toLowerCase().includes(term) ||
        book.isbn?.toLowerCase().includes(term) ||
        book.releaseDate?.toLowerCase().includes(term) ||
        pipe.transform(book.id).includes(term)
    );
}

@Injectable({
    providedIn: 'root',
})
export class BookService {
    public refreshRequired: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _books$ = new BehaviorSubject<Book[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    private _borrowable$: boolean | undefined;

    private _state: State = {
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(private pipe: DecimalPipe, private http: HttpClient) {
        this.refreshRequired.subscribe((value) => {
            if (value) {
                this._search$.next();
            }
        });
        // This pipes some methods that are called when the search$ subject is called
        // The debounceTime is used to prevent the search from being called too often
        // Fetching the data from the server is done in the fetchBooks method
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                // fetch books from backend and set this._books$ to the result with the help of the fetchBooks() function
                tap(() => this.fetchBooks()),
                debounceTime(400),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false))
            )
            .subscribe((result) => {
                this._books$.next(result.books);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get books$() {
        return this._books$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    get loading$() {
        return this._loading$.asObservable();
    }

    get searchTerm() {
        return this._state.searchTerm;
    }

    get borrowable() {
        return this._borrowable$;
    }

    set borrowable(borrowable: boolean | undefined) {
        this._borrowable$ = borrowable;
    }

    set searchTerm(searchTerm: string) {
        this._set({ searchTerm });
    }
    set sortColumn(sortColumn: SortColumn) {
        this._set({ sortColumn });
    }
    set sortDirection(sortDirection: SortDirection) {
        this._set({ sortDirection });
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    public getBookByNakId(nakId: string | undefined): Book | undefined {
        return this._books$.getValue().find((book) => book.nakId === nakId);
    }

    public isNakKeyUnique(nakKey: string | undefined): boolean {
        const books = this._books$.getValue();
        const booksFound = books.find((book) => book.nakId === nakKey);
        return booksFound ? false : true;
    }

    // This method is called when the search$ subject is called
    // It sorts and filters the data and returns the result
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, searchTerm } = this._state;

        // 1. sort
        let books = sort(this._books$.getValue(), sortColumn, sortDirection);

        // 2. filter
        books = books.filter((book) => matches(book, searchTerm, this.pipe));
        const total = books.length;

        return of({ books, total });
    }

    listAllBooks() {
        return this._books$.asObservable();
    }

    deleteBook(bookToBeDeleted: Book) {
        return this.http
            .delete<Book>(BOOKS_URL + '/' + bookToBeDeleted.id)
            .subscribe(() => this.reloadBooks());
    }

    // Sends the book to the backend to be saved
    // Also builds the inventory entry for the book
    saveBook(book: Book) {
        let inventory_Object: InventoryEntry;
        inventory_Object = {
            id: book.inventoryId,
            publication: {
                id: book.id,
                nakId: book.nakId,
                title: book.title,
                authors: book.authors,
                isbn: book.isbn,
                publisher: book.publisher,
                releaseDate: book.releaseDate,
                keywords: book.keywords?.map((keyword) => ({ id: keyword.id })),
                publicationType: book.publicationType,
            },
            amountInStock: book.amountInStock,
            amountBorrowed: book.amountBorrowed,
        };

        return this.http
            .put<Book>(BOOKS_URL, inventory_Object)
            .subscribe(() => {
                this.reloadBooks();
            });
    }

    // Fetches the books from the backend
    // Also sets the inventoryId and the amounts for each book
    fetchBooks() {
        return this.http.get<Book[]>(BOOKS_URL).subscribe((books) => {
            let bookList: Book[] = [];

            books.forEach((inventory: any) => {
                let constructedBook: Book;
                constructedBook = {
                    id: inventory.publication.id,
                    nakId: inventory.publication.nakId,
                    inventoryId: inventory.id,
                    title: inventory.publication.title,
                    authors: inventory.publication.authors,
                    releaseDate: inventory.publication.releaseDate,
                    publisher: inventory.publication.publisher,
                    isbn: inventory.publication.isbn,
                    amountInStock: inventory.amountInStock,
                    amountBorrowed: inventory.amountBorrowed,
                    publicationType: inventory.publication.publicationType,
                    keywords: inventory.publication.keywords,
                };
                bookList.push(constructedBook);
            });

            if (this._borrowable$) {
                bookList = bookList.filter(
                    (book: any) => book.amountInStock > book.amountBorrowed
                );
            }

            this._books$.next(bookList);
            this._total$.next(bookList.length);
        });
    }

    reloadBooks() {
        return this.refreshRequired.next(true);
    }

    // implement borrow book function that sends http request to a backend
    borrowBook(book: Book, borrower: Borrower) {
        return this.http
            .post(BORROWING_URL, {
                borrowerId: borrower.id,
                publicationId: book.id,
            })
            .subscribe(() => {
                this.reloadBooks();
            });
    }
}
