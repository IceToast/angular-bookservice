import { Dunning, DunningProcess } from './../../shared/borrower';
import { DunningService } from './../../shared/borrowings.service';
import { BorrowingsService } from 'src/app/shared/borrowings.service';
import { Component, OnInit } from '@angular/core';
import { Borrowing } from 'src/app/shared/borrower';

@Component({
    selector: 'app-dunning',
    templateUrl: './dunning.component.html',
    styleUrls: ['./dunning.component.scss'],
})
export class DunningComponent implements OnInit {
    dunnings: DunningProcess[] = [];
    borrowings: Borrowing[] = [];

    constructor(
        public borrowingService: BorrowingsService,
        public dunningService: DunningService
    ) {}

    ngOnInit(): void {
        this.dunningService.dunnings$.subscribe((value) => {
            this.dunnings = value;
        });
        this.borrowingService.borrowings$.subscribe((value) => {
            this.borrowings = value;
        });
    }

    onDunning(dunningProcess: DunningProcess) {
        this.dunningService.admonish(dunningProcess);
    }

    onReturnBook(borrowing: Borrowing) {
        this.borrowingService.returnBook(borrowing);
        this.borrowingService.borrowings$.subscribe((value) => {
            this.borrowings = value;
            this.dunningService.reloadDunnings();
        });
    }

    onReportLoss(dunningProcess: DunningProcess) {
        this.dunningService.markAsLost(dunningProcess);
    }
}
