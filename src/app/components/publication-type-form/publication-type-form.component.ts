import { PublicationTypeService } from 'src/app/shared/base-data.service';
import {
    Component,
    Input,
    OnInit,
    Output,
    ViewChild,
    EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PublicationType } from 'src/app/shared/base-data';

@Component({
    selector: 'app-publication-type-form',
    templateUrl: './publication-type-form.component.html',
    styleUrls: ['./publication-type-form.component.scss'],
})
export class PublicationTypeFormComponent implements OnInit {
    @ViewChild('form') form!: NgForm;
    @Input() publicationType!: PublicationType;
    @Output() cancel = new EventEmitter();
    @Output() save = new EventEmitter();

    constructor(public service: PublicationTypeService) {}

    onSubmit() {
        if (this.form.valid) {
            this.save.emit();
        }
    }

    onCancel() {
        this.cancel.emit();
    }

    ngOnInit(): void {}
}
