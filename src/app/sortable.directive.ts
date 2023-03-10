import { Borrowing, DunningProcess } from './shared/borrower';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Book } from './shared/book';
import { PublicationType, Borrower, Keyword } from './shared/base-data';

export type SortColumn =
    | keyof Book
    | keyof PublicationType
    | keyof Borrower
    | keyof Keyword
    | keyof Borrowing
    | keyof DunningProcess
    | any
    | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
    asc: 'desc',
    desc: '',
    '': 'asc',
};

export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}

@Directive({
    selector: 'th[sortable]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()',
    },
})
export class SortableDirective {
    @Input() sortable: SortColumn = '';
    @Input() direction: SortDirection = '';
    @Output() sort = new EventEmitter<SortEvent>();

    rotate() {
        this.direction = rotate[this.direction];
        this.sort.emit({ column: this.sortable, direction: this.direction });
    }
}
