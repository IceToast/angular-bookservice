import { BorrowingsService } from './../../shared/borrowings.service';
import { Component, OnInit } from '@angular/core';
import { Borrowing } from 'src/app/shared/borrower';

@Component({
    selector: 'app-borrowings',
    templateUrl: './borrowings.component.html',
    styleUrls: ['./borrowings.component.scss'],
})
export class BorrowingsComponent implements OnInit {
    borrowings: Borrowing[] = [];

    constructor(private borrowingService: BorrowingsService) {}

    ngOnInit(): void {
        this.borrowingService.publication_id = undefined;
        this.borrowingService.reloadBorrowings();
        this.borrowingService.borrowings$.subscribe((value) => {
            this.borrowings = value;
        });
    }

    onReturnBook(borrowing: Borrowing) {
        this.borrowingService.returnBook(borrowing);
    }
}
