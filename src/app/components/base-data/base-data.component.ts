import { Component, OnInit } from '@angular/core';
import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-base-data',
    templateUrl: './base-data.component.html',
    styleUrls: ['./base-data.component.scss'],
    providers: [NgbNavConfig],
})
export class BaseDataComponent {
    constructor(config: NgbNavConfig) {
        config.destroyOnHide = true;
        config.roles = false;
    }
}
