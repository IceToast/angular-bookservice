import {
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
    OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { SortableDirective, SortEvent } from 'src/app/sortable.directive';
import { PublicationTypeService } from 'src/app/shared/base-data.service';
import { PublicationType } from 'src/app/shared/base-data';

@Component({
    selector: 'app-publication-type-table',
    templateUrl: './publication-type-table.component.html',
    styleUrls: ['./publication-type-table.component.scss'],
    providers: [DecimalPipe, PublicationTypeService],
})
export class PublicationTypeTableComponent implements OnInit {
    @Input() publicationTypes: PublicationType[] = [];

    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
    @Output() add = new EventEmitter();
    @Output() edit = new EventEmitter<PublicationType>();
    @Output() delete = new EventEmitter<PublicationType>();

    constructor(public service: PublicationTypeService) {
        service.reloadPublicationTypes();
    }

    ngOnInit(): void {
        this.service.reloadPublicationTypes();
    }

    isPublicationTypesEmpty() {
        return this.publicationTypes.length == 0;
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

    onAdd(): void {
        this.add.emit();
    }

    onEdit(publicationType: PublicationType) {
        this.edit.emit(publicationType);
    }

    onDelete(publicationType: PublicationType) {
        this.delete.emit(publicationType);
    }
}
