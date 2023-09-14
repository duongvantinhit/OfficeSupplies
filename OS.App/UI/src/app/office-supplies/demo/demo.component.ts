import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
    constructor() {}

    a = 10;

    ngOnInit() {
        console.log(this.a);
    }
}
