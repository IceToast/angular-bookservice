import { PublicationTypeService } from './../../shared/base-data.service';
import { PublicationType } from 'src/app/shared/base-data';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-publication-type',
    templateUrl: './publication-type.component.html',
    styleUrls: ['./publication-type.component.scss'],
})
export class PublicationTypeComponent implements OnInit {
    currentPublicationType?: PublicationType;
    publicationTypes: PublicationType[] = [];

    constructor(public publicationTypeService: PublicationTypeService) {}

    ngOnInit(): void {
        this.publicationTypeService.publicationTypes$.subscribe(
            (value) => (this.publicationTypes = value)
        );
    }

    onAddPublicationType(): void {
        this.currentPublicationType = new PublicationType();
    }

    onEditPublicationType(publicationType: PublicationType) {
        this.currentPublicationType = publicationType;
    }

    onDeletePublicationType(publicationType: PublicationType) {
        if (publicationType) {
            this.publicationTypeService.deletePublicationType(publicationType);
        }
    }

    onSavePublicationType() {
        if (this.currentPublicationType) {
            this.publicationTypeService.savePublicationType(
                this.currentPublicationType
            );
            this.reloadList();
        }
    }

    onCancelPublicationType() {
        this.currentPublicationType = undefined;
    }

    private reloadList() {
        this.currentPublicationType = undefined;
        this.publicationTypeService.publicationTypes$.subscribe(
            (value) => (this.publicationTypes = value)
        );
    }
}
