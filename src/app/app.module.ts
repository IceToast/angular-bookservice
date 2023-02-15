import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BooksTableComponent } from './components/books-table/books-table.component';
import { SortableDirective } from './sortable.directive';
import { BooksFormComponent } from './components/books-form/books-form.component';
import { BooksComponent } from './components/books/books.component';
import { DecimalPipe } from '@angular/common';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BaseDataComponent } from './components/base-data/base-data.component';
import { PublicationTypeComponent } from './components/publication-type/publication-type.component';
import { BorrowerComponent } from './components/borrower/borrower.component';
import { KeywordsComponent } from './components/keywords/keywords.component';
import { PublicationTypeTableComponent } from './components/publication-type-table/publication-type-table.component';
import { BorrowerTableComponent } from './components/borrower-table/borrower-table.component';
import { KeywordsTableComponent } from './components/keywords-table/keywords-table.component';
import { KeywordsFormComponent } from './components/keywords-form/keywords-form.component';
import { PublicationTypeFormComponent } from './components/publication-type-form/publication-type-form.component';
import { BorrowerFormComponent } from './components/borrower-form/borrower-form.component';
import { BookBorrowComponent } from './components/book-borrow/book-borrow.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BorrowingsComponent } from './components/borrowings/borrowings.component';
import { BorrowingsTableComponent } from './components/borrowings-table/borrowings-table.component';
import { DunningComponent } from './components/dunning/dunning.component';
import { DunningTableComponent } from './components/dunning-table/dunning-table.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        BooksTableComponent,
        SortableDirective,
        BooksFormComponent,
        BooksComponent,
        NavigationComponent,
        BaseDataComponent,
        PublicationTypeComponent,
        BorrowerComponent,
        KeywordsComponent,
        PublicationTypeTableComponent,
        BorrowerTableComponent,
        KeywordsTableComponent,
        KeywordsFormComponent,
        PublicationTypeFormComponent,
        BorrowerFormComponent,
        BookBorrowComponent,
        BorrowingsComponent,
        BorrowingsTableComponent,
        DunningComponent,
        DunningTableComponent,
        BookDetailComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        NoopAnimationsModule,
        FormsModule,
    ],
    providers: [DecimalPipe],
    bootstrap: [AppComponent],
})
export class AppModule {}
