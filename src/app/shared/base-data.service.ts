import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { SortColumn, SortDirection } from '../sortable.directive';
import { PublicationType, Borrower, Keyword } from './base-data';
import {
    BORROWERS,
    KEYWORDS,
    PUBLICATION_TYPES,
} from './../../assets/basedataMock';

const host = '/api/v1';
const PUBLICATION_TYPES_URL = host + '/publicationTypeController';
const BORROWERS_URL = host + '/borrowerController';
const KEYWORDS_URL = host + '/keywordController';

interface SearchResult {
    items: PublicationType[] | Borrower[] | Keyword[];
    total: number;
}

interface State {
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

// Generic compare function
const compare = (v1, v2) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

// Function to sort the base-data entries
function sort(
    items: PublicationType[] | Borrower[] | Keyword[],
    column: SortColumn,
    direction: string
): PublicationType[] | Borrower[] | Keyword[] {
    if (direction === '' || column === '') {
        return items;
    } else {
        return [...items].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

// Function to match the search term with the publication type
function matchesPublicationType(
    item: PublicationType,
    text: string,
    pipe: PipeTransform
): boolean {
    const term = text.toLowerCase();
    return (
        item.type?.toLowerCase().includes(term) ||
        pipe.transform(item.id).includes(term)
    );
}

// Function to match the search term with the borrower
function matchesBorrower(
    item: Borrower,
    text: string,
    pipe: PipeTransform
): boolean {
    const term = text.toLowerCase();
    return (
        item.firstName?.toLowerCase().includes(term) ||
        item.surName?.toLowerCase().includes(term) ||
        pipe.transform(item.id).includes(term) ||
        pipe.transform(item.matriculationNumber).includes(term)
    );
}

// Function to match the search term with the keyword
function matchesKeywords(
    item: Keyword,
    text: string,
    pipe: PipeTransform
): boolean {
    const term = text.toLowerCase();
    return (
        item.keyword?.toLowerCase().includes(term) ||
        pipe.transform(item.id).includes(term)
    );
}

@Injectable({
    providedIn: 'root',
})
export class PublicationTypeService {
    public refreshRequired: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _publicationTypes$ = new BehaviorSubject<PublicationType[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

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
        // Fetching the data from the server is done in the fetchPublicationTypes method
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                tap(() => this.fetchPublicationTypes()),
                debounceTime(400),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false))
            )
            .subscribe((result) => {
                this._publicationTypes$.next(result.items);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get publicationTypes$() {
        return this._publicationTypes$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    get loading$() {
        return this._loading$.asObservable();
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

    public isPublicationTypeUnique(type: string | undefined) {
        const publicationTypes = this._publicationTypes$.getValue();
        const publicationTypeFound = publicationTypes.find(
            (item) => item.type === type
        );
        return publicationTypeFound ? false : true;
    }

    // This method is called when the search$ subject is called
    // It sorts and filters the data and returns the result
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, searchTerm } = this._state;

        // 1. sort
        let publicationTypes = sort(
            this._publicationTypes$.getValue(),
            sortColumn,
            sortDirection
        ) as PublicationType[];

        // 2. filter
        publicationTypes = publicationTypes.filter((item: PublicationType) =>
            matchesPublicationType(item, searchTerm, this.pipe)
        );
        const total = publicationTypes.length;

        return of({ items: publicationTypes, total });
    }

    savePublicationType(publicationType: PublicationType) {
        return this.http
            .put(PUBLICATION_TYPES_URL, publicationType)
            .subscribe(() => this.reloadPublicationTypes());
    }

    deletePublicationType(publicationType: PublicationType) {
        return this.http
            .delete(PUBLICATION_TYPES_URL + '/' + publicationType.id)
            .subscribe(() => this.reloadPublicationTypes());
    }

    fetchPublicationTypes() {
        return this.http
            .get<PublicationType[]>(PUBLICATION_TYPES_URL)
            .subscribe((publicationTypes) => {
                this._publicationTypes$.next(publicationTypes);
                this._total$.next(publicationTypes.length);
            });
    }

    reloadPublicationTypes() {
        this.refreshRequired.next(true);
    }
}

@Injectable({
    providedIn: 'root',
})
export class BorrowerService {
    public refreshRequired: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _borrowers$ = new BehaviorSubject<Borrower[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

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
        // Fetching the data from the server is done in the fetchBorrowers method
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                tap(() => this.fetchBorrowers()),
                debounceTime(400),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false))
            )
            .subscribe((result) => {
                this._borrowers$.next(result.items);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get borrowers$() {
        return this._borrowers$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    get loading$() {
        return this._loading$.asObservable();
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

    public getBorrowerByMatriculationNumber(matNr: number | undefined) {
        return this._borrowers$
            .getValue()
            .find((item) => item.matriculationNumber === matNr);
    }

    public isMatriculationNumberUnique(matNr: number | undefined): boolean {
        const borrowers = this._borrowers$.getValue();
        const matNrFound = borrowers.find(
            (item) => item.matriculationNumber === matNr
        );

        console.log(matNr, matNrFound);
        return matNrFound ? false : true;
    }

    // This method is called when the search$ subject is called
    // It sorts and filters the data and returns the result
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, searchTerm } = this._state;

        // 1. sort
        let borrowers = sort(
            this._borrowers$.getValue(),
            sortColumn,
            sortDirection
        ) as Borrower[];

        // 2. filter
        borrowers = borrowers.filter((item: Borrower) =>
            matchesBorrower(item, searchTerm, this.pipe)
        );
        const total = borrowers.length;

        return of({ items: borrowers, total });
    }

    saveBorrower(borrower: Borrower) {
        return this.http
            .put(BORROWERS_URL, borrower)
            .subscribe(() => this.reloadBorrowers());
    }

    deleteBorrower(borrower: Borrower) {
        return this.http
            .delete(BORROWERS_URL + '/' + borrower.id)
            .subscribe(() => this.reloadBorrowers());
    }

    fetchBorrowers() {
        return this.http
            .get<Borrower[]>(BORROWERS_URL)
            .subscribe((borrowers) => {
                this._borrowers$.next(borrowers);
                this._total$.next(borrowers.length);
            });
    }

    reloadBorrowers() {
        this.refreshRequired.next(true);
    }
}

@Injectable({
    providedIn: 'root',
})
export class KeywordService {
    public refreshRequired: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _keywords$ = new BehaviorSubject<Keyword[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

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
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                tap(() => this.fetchKeywords()),
                debounceTime(400),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false))
            )
            .subscribe((result) => {
                this._keywords$.next(result.items);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get keywords$() {
        return this._keywords$.asObservable();
    }

    get total$() {
        return this._total$.asObservable();
    }

    get loading$() {
        return this._loading$.asObservable();
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

    public isKeyWordUnique(keyword: string | undefined): boolean {
        const keywords = this._keywords$.getValue();
        const keywordFound = keywords.find((item) => item.keyword === keyword);
        return keywordFound ? false : true;
    }

    // This method is called when the search$ subject is called
    // It sorts and filters the data and returns the result
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, searchTerm } = this._state;

        // 1. sort
        let keywords = sort(
            this._keywords$.getValue(),
            sortColumn,
            sortDirection
        ) as Keyword[];

        // 2. filter
        keywords = keywords.filter((item: Keyword) =>
            matchesKeywords(item, searchTerm, this.pipe)
        );
        const total = keywords.length;

        return of({ items: keywords, total });
    }

    saveKeyword(keyword: Keyword) {
        return this.http
            .put(KEYWORDS_URL, keyword)
            .subscribe(() => this.reloadKeywords());
    }

    deleteKeyword(keyword: Keyword) {
        return this.http
            .delete(KEYWORDS_URL + '/' + keyword.id)
            .subscribe(() => this.reloadKeywords());
    }

    fetchKeywords() {
        return this.http.get<Keyword[]>(KEYWORDS_URL).subscribe((keywords) => {
            this._keywords$.next(keywords);
            this._total$.next(keywords.length);
        });
    }

    reloadKeywords() {
        this.refreshRequired.next(true);
    }
}
