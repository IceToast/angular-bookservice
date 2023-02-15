import {
    Component,
    EventEmitter,
    Input,
    Output,
    QueryList,
    OnInit,
    ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Borrower } from 'src/app/shared/base-data';
import { BorrowerService } from 'src/app/shared/base-data.service';

@Component({
    selector: 'app-borrower-form',
    templateUrl: './borrower-form.component.html',
    styleUrls: ['./borrower-form.component.scss'],
})
export class BorrowerFormComponent implements OnInit {
    @ViewChild('form') form!: NgForm;
    @Input() borrower!: Borrower;

    @Output() cancel = new EventEmitter();
    @Output() save = new EventEmitter();

    constructor(public service: BorrowerService) {}

    onSubmit() {
        if (this.form.valid) {
            this.save.emit();
        }
    }

    isMatriculationNumberUnique(borrower): boolean {
        return (
            this.service.isMatriculationNumberUnique(
                borrower.matriculationNumber
            ) ||
            borrower.id ===
                this.service.getBorrowerByMatriculationNumber(
                    borrower.matriculationNumber
                )?.id
        );
    }

    onCancel() {
        this.cancel.emit();
    }

    ngOnInit(): void {}
}
