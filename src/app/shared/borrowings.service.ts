import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { SortColumn, SortDirection } from '../sortable.directive';
import { Borrowing, Dunning, DunningProcess } from './borrower';

const host = '/api/v1';
const BORROWING_URL = host + '/borrowingProcessController';
const DUNNING_URL = host + '/dunningProcessController';
interface SearchResult {
    items: Borrowing[] | DunningProcess[];
    total: number;
    overdue?: Borrowing[];
}

interface State {
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

// Generic compare function
const compare = (v1, v2) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

// Function that sorts the items
function sort(
    items: Borrowing[] | DunningProcess[],
    column: SortColumn,
    direction: string
): Borrowing[] {
    if (direction === '' || column === '') {
        return items;
    } else {
        return [...items].sort((a, b) => {
            // find the column to sort by -- Can be a top level property or a nested property -> Example 'borrower.firstname'
            const columnA = column.split('.').reduce((o, i) => o[i], a);
            const columnB = column.split('.').reduce((o, i) => o[i], b);
            const res = compare(columnA, columnB);

            return direction === 'asc' ? res : -res;
        });
    }
}

// Function that matches the search term
function matches(borrowing: Borrowing, text: string, pipe: PipeTransform) {
    const term = text.toLowerCase();
    return (
        borrowing.borrower?.firstName?.toLowerCase().includes(term) ||
        borrowing.borrower?.surName?.toLowerCase().includes(term) ||
        borrowing.publication?.title?.toLowerCase().includes(term) ||
        borrowing.publication?.nakId?.toLowerCase().includes(term) ||
        borrowing.borrowDate?.toLowerCase().includes(term) ||
        borrowing.returnDate?.toLowerCase().includes(term) ||
        pipe.transform(borrowing.id).includes(term)
    );
}

@Injectable({
    providedIn: 'root',
})
export class BorrowingsService {
    public refreshRequired: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _borrowings$ = new BehaviorSubject<Borrowing[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    private _publication_id$: number | undefined;

    private _state: State = {
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(private http: HttpClient, private pipe: DecimalPipe) {
        this.refreshRequired.subscribe((value) => {
            if (value) {
                this._search$.next();
            }
        });

        // This pipes some methods that are called when the search$ subject is called
        // The debounceTime is used to prevent the search from being called too often
        // Fetching the data from the server is done in the getBorrowings method
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                tap(() => this.getBorrowings()),
                debounceTime(400),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false))
            )
            .subscribe((result) => {
                this._borrowings$.next(result.items);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get borrowings$() {
        return this._borrowings$.asObservable();
    }

    get searchTerm() {
        return this._state.searchTerm;
    }

    get publication_id() {
        return this._publication_id$;
    }

    set publication_id(value: number | undefined) {
        this._publication_id$ = value;
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

    get total$() {
        return this._total$.asObservable();
    }

    get loading$() {
        return this._loading$.asObservable();
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
        this._search$.next();
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    public getBorrowings() {
        return this.http
            .get<Borrowing[]>(
                `${BORROWING_URL}${
                    this._publication_id$
                        ? '/publication/' + this.publication_id
                        : ''
                }`
            )
            .subscribe((value) => {
                this._borrowings$.next(value);
                if (value === null) {
                    this._total$.next(0);
                } else {
                    this._total$.next(value.length);
                }
            });
    }

    public returnBook(borrowing: Borrowing) {
        return this.http
            .delete<Borrowing>(BORROWING_URL + '/' + borrowing.id)
            .subscribe(() => {
                this.reloadBorrowings();
            });
    }

    // This method is called when the search$ subject is called
    // It sorts and filters the data and returns the result
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, searchTerm } = this._state;

        //if this._borrowings$.value is null
        if (this._borrowings$.value == null) return of({ items: [], total: 0 });

        // 1. sort
        let borrowings = sort(
            this._borrowings$.value,
            sortColumn,
            sortDirection
        );

        // 2. filter
        borrowings = borrowings.filter((borrowing) =>
            matches(borrowing, searchTerm, this.pipe)
        );

        const total = borrowings.length;

        // 3. paginate
        return of({ items: borrowings, total });
    }

    reloadBorrowings() {
        this.refreshRequired.next(true);
    }
}

// dunning service
@Injectable({
    providedIn: 'root',
})
export class DunningService {
    public refreshRequired: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _dunnings$ = new BehaviorSubject<DunningProcess[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(private http: HttpClient, private pipe: DecimalPipe) {
        this.refreshRequired.subscribe((value) => {
            if (value) {
                this._search$.next();
            }
        });
        // This pipes some methods that are called when the search$ subject is called
        // The debounceTime is used to prevent the search from being called too often
        // Fetching the data from the server is done in the getDunnings method
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                tap(() => this.getDunnings()),
                debounceTime(400),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false))
            )
            .subscribe((result) => {
                this._dunnings$.next(result.items);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get dunnings$() {
        return this._dunnings$.asObservable();
    }

    get searchTerm() {
        return this._state.searchTerm;
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

    get total$() {
        return this._total$.asObservable();
    }

    get loading$() {
        return this._loading$.asObservable();
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
        this._search$.next();
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }
    public getDunnings() {
        return this.http
            .get<DunningProcess[]>(DUNNING_URL)
            .subscribe((value) => {
                let dunnings = value;

                dunnings.forEach((dunning) => {
                    // calc max date of dunning.dunnings[].date and set it to dunning.lastDunningDate
                    // dunning.dunnings[].date is a string, so we have to convert it to a date object
                    // and then compare it to the other dates
                    // format of dunning.dunnings[].date is "2021-05-01"
                    let dates = dunning.dunnings?.map((d: Dunning) => {
                        // if d.date is null, we have to return a date object with the earliest possible date
                        if (!d.date) return new Date(0);
                        // split the string at the "-" and convert the parts to numbers
                        let dateParts = d.date.split('-');
                        return new Date(
                            +dateParts[0],

                            +dateParts[1] - 1,
                            +dateParts[2] + 1
                        );
                    });
                    if (dates) {
                        // find the max date
                        let maxDate = dates.reduce((a, b) => {
                            return a > b ? a : b;
                        }, new Date(0));
                        // convert the max date to a string
                        let maxDateStr = maxDate.toISOString().split('T')[0];
                        // set the max date to the dunning object if it is not date 1970-01-01
                        dunning.lastDunningDate =
                            maxDateStr === '1970-01-01' ? '-' : maxDateStr;
                    }
                });

                this._dunnings$.next(dunnings);
                this._total$.next(value.length);
            });
    }

    public reloadDunnings() {
        this.refreshRequired.next(true);
    }

    public admonish(dunningProcess: DunningProcess) {
        return this.http
            .post(DUNNING_URL, {
                borrowingProcessId: dunningProcess.borrowingProcess?.id,
            })
            .subscribe(() => {
                this.reloadDunnings();
            });
    }

    public markAsLost(dunningProcess: DunningProcess) {
        return this.http
            .delete(DUNNING_URL + '/' + dunningProcess.id)
            .subscribe(() => {
                this.reloadDunnings();
            });
    }

    // This method is called when the search$ subject is called
    // It sorts and filters the data and returns the result
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, searchTerm } = this._state;

        // 1. sort
        let dunnings = sort(this._dunnings$.value, sortColumn, sortDirection);

        // 2. filter
        dunnings = dunnings.filter((dunning) =>
            matches(dunning, searchTerm, this.pipe)
        );
        const total = dunnings.length;

        // 3. paginate
        return of({ items: dunnings, total });
    }
}
