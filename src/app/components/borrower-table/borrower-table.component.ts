import {
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { SortableDirective, SortEvent } from 'src/app/sortable.directive';
import { BorrowerService } from 'src/app/shared/base-data.service';
import { Borrower } from 'src/app/shared/base-data';

@Component({
    selector: 'app-borrower-table',
    templateUrl: './borrower-table.component.html',
    styleUrls: ['./borrower-table.component.scss'],
    providers: [DecimalPipe, BorrowerService],
})
export class BorrowerTableComponent {
    @Input() borrowers: Borrower[] = [];

    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter<Borrower>();
    @Output() delete = new EventEmitter<Borrower>();

    constructor(public service: BorrowerService) {}

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

    onAdd(): void {
        this.add.emit();
    }

    isBorrowersEmpty() {
        return this.borrowers.length == 0;
    }

    onEdit(borrower: Borrower): void {
        if (borrower) {
            this.edit.emit(borrower);
        }
    }

    onDelete(borrower: Borrower): void {
        if (borrower) {
            this.delete.emit(borrower);
        }
    }
}
