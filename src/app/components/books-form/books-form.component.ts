import { Keyword, PublicationType } from './../../shared/base-data';
import { Observable } from 'rxjs';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Book } from '../../shared/book';
import {
    KeywordService,
    PublicationTypeService,
} from 'src/app/shared/base-data.service';
import { BookService } from 'src/app/shared/book.service';

@Component({
    selector: 'app-books-form',
    templateUrl: './books-form.component.html',
    styleUrls: ['./books-form.component.scss'],
    providers: [KeywordService, PublicationTypeService],
})
export class BooksFormComponent implements OnInit {
    @ViewChild('form') form!: NgForm;
    @Input() book!: Book;
    keywords$: Observable<Keyword[]>;
    publicationTypes$: Observable<PublicationType[]>;

    // change title of html based on if book is new or existing
    @Output() cancel = new EventEmitter();
    @Output() submit = new EventEmitter();

    constructor(
        public keywordService: KeywordService,
        public publicationTypeService: PublicationTypeService,
        public bookService: BookService
    ) {
        this.keywords$ = keywordService.keywords$;
        this.publicationTypes$ = publicationTypeService.publicationTypes$;
    }

    compareByValue(k1: Keyword, k2: Keyword) {
        return k1 && k2 ? k1.id === k2.id : k1 === k2;
    }

    isNakIdUnique(book: Book) {
        console.log(
            this.bookService.isNakKeyUnique(book.nakId) ||
                book.id === this.bookService.getBookByNakId(book.nakId)?.id
        );

        return (
            this.bookService.isNakKeyUnique(book.nakId) ||
            book.id === this.bookService.getBookByNakId(book.nakId)?.id
        );
    }

    getTitle() {
        return this.book.id ? 'Publikation bearbeiten' : 'Publikation anlegen';
    }

    onSubmit() {
        if (this.form.valid) {
            this.submit.emit();
        }
    }

    includesKeyword(keyword: Keyword) {
        return this.book.keywords?.some((k: Keyword) => k.id === keyword.id);
    }

    onCancel() {
        this.cancel.emit();
    }

    ngOnInit(): void {}
}
