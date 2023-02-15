import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/shared/book';
import { Borrowing } from 'src/app/shared/borrower';
import { BorrowingsService } from './../../shared/borrowings.service';

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
    @Input() book: Book;
    borrowings: Borrowing[] = [];

    @Output() cancel = new EventEmitter();

    constructor(private borrowingService: BorrowingsService) {}

    ngOnInit(): void {
        this.borrowingService.publication_id = this.book.id;

        this.borrowingService.reloadBorrowings();
        this.borrowingService.borrowings$.subscribe((value) => {
            this.borrowings = value;
        });
    }

    onReturnBook(borrowing: Borrowing) {
        this.borrowingService.returnBook(borrowing);
    }

    onCancelBook() {
        this.cancel.emit();
    }
}
