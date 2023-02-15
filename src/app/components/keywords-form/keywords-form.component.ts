import { KeywordService } from 'src/app/shared/base-data.service';
import { Keyword } from 'src/app/shared/base-data';
import {
    Component,
    Input,
    OnInit,
    Output,
    ViewChild,
    EventEmitter,
} from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-keywords-form',
    templateUrl: './keywords-form.component.html',
    styleUrls: ['./keywords-form.component.scss'],
})
export class KeywordsFormComponent implements OnInit {
    @ViewChild('form') form!: NgForm;
    @Input() keyword!: Keyword;

    @Output() cancel = new EventEmitter();
    @Output() save = new EventEmitter();

    constructor(public service: KeywordService) {}

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
