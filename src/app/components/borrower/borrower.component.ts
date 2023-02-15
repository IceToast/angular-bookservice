import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Borrower } from 'src/app/shared/base-data';
import { BorrowerService } from './../../shared/base-data.service';

@Component({
    selector: 'app-borrower',
    templateUrl: './borrower.component.html',
    styleUrls: ['./borrower.component.scss'],
})
export class BorrowerComponent implements OnInit {
    currentBorrower?: Borrower;
    borrowers: Borrower[] = [];

    constructor(public borrowerService: BorrowerService) {}

    onAddBorrower(): void {
        this.currentBorrower = new Borrower();
    }

    onEditBorrower(borrower: Borrower) {
        this.currentBorrower = borrower;
    }

    onDeleteBorrower(borrower: Borrower) {
        if (borrower) {
            this.borrowerService.deleteBorrower(borrower);
        }
    }

    onSaveBorrower() {
        if (this.currentBorrower) {
            this.borrowerService.saveBorrower(this.currentBorrower);
            this.reloadList();
        }
    }

    onCancelBorrower() {
        this.currentBorrower = undefined;
    }

    private reloadList() {
        this.currentBorrower = undefined;
        this.borrowerService.borrowers$.subscribe(
            (value) => (this.borrowers = value)
        );
    }

    ngOnInit(): void {
        this.reloadList();
    }
}
