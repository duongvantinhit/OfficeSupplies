import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficeSuppliesService } from '../services/office-supplies.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
    constructor(
        private _apiServices: OfficeSuppliesService,
        private _actRoute: ActivatedRoute,
        private _router: Router,
    ) {}

    productId: any;
    product: any;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;

        this.productId = route['id'];

        this._apiServices.getData('/product', this.productId).subscribe((res) => {
            console.log(res.data);
            this.product = res.data;
        });
    }
    value1: number = 1;
}
