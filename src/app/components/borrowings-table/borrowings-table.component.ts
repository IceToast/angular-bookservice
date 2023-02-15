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
import { Borrowing } from 'src/app/shared/borrower';

@Component({
    selector: 'app-borrowings-table',
    templateUrl: './borrowings-table.component.html',
    styleUrls: ['./borrowings-table.component.scss'],
})
export class BorrowingsTableComponent implements OnInit {
    @Input() borrowings: Borrowing[] = [];

    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    @Output() returnBook = new EventEmitter<Borrowing>();

    constructor(public service: BorrowingsService) {
        service.reloadBorrowings();
    }

    ngOnInit(): void {
        this.service.reloadBorrowings();
    }

    isBorrowingsEmpty() {
        return this.borrowings.length === 0;
    }

    onReturnBook(borrowing: Borrowing) {
        if (borrowing) {
            this.returnBook.emit(borrowing);
        }
    }

    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.service.sortColumn = column;
        this.service.sortDirection = direction;
    }
}
