import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        this.selectedCategory = this.categories[0];
    }

    sortType = ['Tăng dần', 'Giảm dần'];
    selectedCity: any;
    selectedCategory: any = null;
    categories: any[] = [
        { name: '>100.000', key: '100000' },
        { name: '>200.000', key: '200000' },
        { name: '>1.000.000', key: '1000000' },
        { name: '>5.000.000', key: '5000000' },
    ];

    first: number = 0;

    rows: number = 10;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
}
