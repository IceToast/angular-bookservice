import { Component } from '@angular/core';
import { NgbNavConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    providers: [NgbNavConfig],
})
export class NavigationComponent {
    constructor(config: NgbNavConfig) {
        config.destroyOnHide = true;
        config.roles = false;
    }
}
