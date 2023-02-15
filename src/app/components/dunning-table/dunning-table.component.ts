import { DunningProcess } from './../../shared/borrower';
import { DunningService } from './../../shared/borrowings.service';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
    OnInit,
} from '@angular/core';
import { SortableDirective, SortEvent } from 'src/app/sortable.directive';
import { BorrowingsService } from 'src/app/shared/borrowings.service';
import { Borrowing, Dunning } from 'src/app/shared/borrower';

@Component({
    selector: 'app-dunning-table',
    templateUrl: './dunning-table.component.html',
    styleUrls: ['./dunning-table.component.scss'],
})
export class DunningTableComponent implements OnInit {
    @Input() dunnings: Dunning[] = [];

    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    @Output() returnBook = new EventEmitter<Borrowing>();
    @Output() dunning = new EventEmitter<Borrowing>();
    @Output() reportLoss = new EventEmitter<Borrowing>();

    constructor(public dunningService: DunningService) {
        dunningService.reloadDunnings();
    }

    ngOnInit(): void {
        this.dunningService.reloadDunnings();
    }

    isDunningsEmpty() {
        return this.dunnings.length == 0;
    }

    onReturnBook(dunningProcess: DunningProcess) {
        if (dunningProcess.borrowingProcess) {
            this.returnBook.emit(dunningProcess.borrowingProcess);
        }
    }

    onDunning(dunningProcess: DunningProcess) {
        if (dunningProcess) {
            this.dunning.emit(dunningProcess);
        }
    }

    hasThreeDunnings(dunningProcess: DunningProcess) {
        if (dunningProcess.dunnings) {
            return dunningProcess.dunnings.length >= 3;
        }
        return false;
    }

    onReportLoss(dunningProcess: DunningProcess) {
        if (dunningProcess) {
            this.reportLoss.emit(dunningProcess);
        }
    }

    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.dunningService.sortColumn = column;
        this.dunningService.sortDirection = direction;
    }
}
