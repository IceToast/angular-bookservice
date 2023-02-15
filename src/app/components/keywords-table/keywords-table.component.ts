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
import { SortableDirective, SortEvent } from 'src/app/sortable.directive';
import { KeywordService } from 'src/app/shared/base-data.service';
import { Keyword } from 'src/app/shared/base-data';

@Component({
    selector: 'app-keywords-table',
    templateUrl: './keywords-table.component.html',
    styleUrls: ['./keywords-table.component.scss'],
    providers: [DecimalPipe],
})
export class KeywordsTableComponent {
    @Input() keywords: Keyword[] = [];

    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter<Keyword>();
    @Output() delete = new EventEmitter<Keyword>();

    constructor(public service: KeywordService) {}

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

    isKeywordsEmpty() {
        return this.keywords.length == 0;
    }

    onAdd(): void {
        this.add.emit();
    }

    onEdit(keyword: Keyword) {
        this.edit.emit(keyword);
    }

    onDelete(keyword: Keyword) {
        this.delete.emit(keyword);
    }
}
