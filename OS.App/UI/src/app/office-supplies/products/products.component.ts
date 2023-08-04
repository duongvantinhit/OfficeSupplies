import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficeSuppliesService } from '../services/office-supplies.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
    constructor(
        private _apiServices: OfficeSuppliesService,
        private _actRoute: ActivatedRoute,
        private _router: Router,
    ) {}

    first = 0;
    totalRecords: number = 0;
    getPageNumber = 1;
    setPageNumber: any;
    products: any;
    pageType: any;

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts(event: any = null) {
        let loadPageForm = {
            pageIndex: event ? event.first / event.rows + 1 : 1,
            pageSize: event ? event.rows : 15,
        };

        event ? (this.getPageNumber = event.first / event.rows + 1) : (this.first = 0);

        this._apiServices.getPageInfor.subscribe((res) => {
            this.setPageNumber = res;
        });

        if (this._router.routerState.snapshot.url.includes('products')) {
            this.pageType = 'products';
        }

        if (!event && this.setPageNumber) {
            loadPageForm = {
                pageIndex: this.setPageNumber,
                pageSize: event ? event.rows : 15,
            };

            this._apiServices.loadPages(loadPageForm, `/products`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.products = res.data;
                this.first = (this.setPageNumber - 1) * 15;
                this.getPageNumber = this.setPageNumber;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, `/products`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.products = res.data;
            });
        }
    }

    productDetail(productId: any) {
        this._router.navigate(['/product/detail'], {
            queryParams: { id: productId, page: this.getPageNumber },
        });
    }
}
