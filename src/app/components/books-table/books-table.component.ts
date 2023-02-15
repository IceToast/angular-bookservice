import { Observable } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
    OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BookService } from '../../shared/book.service';
import { SortableDirective, SortEvent } from 'src/app/sortable.directive';
import { Book } from 'src/app/shared/book';

@Component({
    selector: 'app-books-table',
    templateUrl: './books-table.component.html',
    styleUrls: ['./books-table.component.scss'],
})
export class BooksTableComponent implements OnInit {
    @Input() books: Book[] = [];
    borrowable: boolean = false;

    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter<Book>();
    @Output() delete = new EventEmitter<Book>();
    @Output() borrow = new EventEmitter<Book>();
    @Output() detail = new EventEmitter<Book>();

    constructor(public service: BookService) {
        service.reloadBooks();
        service.borrowable = this.borrowable;
    }

    ngOnInit(): void {
        this.service.reloadBooks();
    }

    onBorrowableChange() {
        this.service.borrowable = this.borrowable;
        this.service.reloadBooks();
    }

    isBooksEmpty() {
        return this.books.length == 0;
    }

    isBorrowable(book: Book) {
        if (book.amountBorrowed && book.amountInStock)
            return book.amountInStock > book.amountBorrowed;
        if (!book.amountBorrowed && book.amountInStock) return true;
        return false;
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

    onDetail(book: Book) {
        if (book) {
            this.detail.emit(book);
        }
    }

    onAdd() {
        this.add.emit();
    }

    onBorrow(book: Book) {
        if (book) {
            this.borrow.emit(book);
        }
    }

    onEdit(book: Book) {
        if (book) {
            this.edit.emit(book);
        }
    }

    onDelete(book: Book) {
        if (book) {
            this.delete.emit(book);
        }
    }
}
