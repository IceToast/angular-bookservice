import { Borrower } from 'src/app/shared/base-data';
import { BorrowerService } from './../../shared/base-data.service';
import { Observable } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { Book } from '../../shared/book';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-book-borrow',
    templateUrl: './book-borrow.component.html',
    styleUrls: ['./book-borrow.component.scss'],
    providers: [BorrowerService],
})
export class BookBorrowComponent implements OnInit {
    @ViewChild('form') form!: NgForm;
    @Input() book!: Book;
    @Input() borrower!: Borrower;
    borrowers$: Observable<Borrower[]>;

    @Output() cancel = new EventEmitter<void>();
    @Output() submit = new EventEmitter<Borrower>();

    constructor(public borrowerService: BorrowerService) {
        this.borrowers$ = borrowerService.borrowers$;
    }

    onSubmit() {
        if (this.form.valid) {
            this.submit.emit(this.borrower);
        }
    }

    onCancel() {
        this.cancel.emit();
    }

    ngOnInit(): void {}
}
