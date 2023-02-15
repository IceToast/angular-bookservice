import { Borrower } from 'src/app/shared/base-data';
import { Component, OnInit } from '@angular/core';
import { Book } from '../../shared/book';
import { BookService } from '../../shared/book.service';

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss'],
})
export class BooksComponent implements OnInit {
    currentBook?: Book;
    books: Book[] = [];
    mode: string;

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.bookService.books$.subscribe((value) => {
            this.books = value;
        });
    }

    onDetailBook(book: Book) {
        this.mode = 'detail';
        this.currentBook = book;
    }

    onAddBook(): void {
        this.mode = 'create';
        this.currentBook = new Book();
        this.currentBook.amountBorrowed = 0;
        this.currentBook.releaseDate = new Date().toISOString().split('T')[0];
    }

    onEditBook(book: Book) {
        this.mode = 'edit';
        this.currentBook = book;
    }

    onDeleteBook(book: Book) {
        this.bookService.deleteBook(book);
    }

    onSaveBook() {
        if (this.currentBook) {
            this.bookService.saveBook(this.currentBook);
            this.reloadList();
        }
    }

    onCancelBook() {
        this.currentBook = undefined;
        this.reloadList();
    }

    private reloadList() {
        this.currentBook = undefined;
        this.bookService.books$.subscribe((value) => {
            this.books = value;
        });
    }

    onBorrowBook(book: Book) {
        this.mode = 'borrow';
        this.currentBook = book;
    }

    onBorrowingBook(borrower: Borrower) {
        if (this.currentBook && borrower) {
            this.bookService.borrowBook(this.currentBook, borrower);
            this.reloadList();
        }
    }
}
