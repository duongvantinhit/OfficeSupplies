import { Component, OnInit } from '@angular/core';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
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
    categoryId: any;
    categoryName: any;
    currentRoute: any;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;

        this.categoryId = route['id'];
        this.categoryName = route['name'];
        this.loadProducts();
        this.currentRoute = this._router.routerState.snapshot.url;

        this._actRoute.queryParams.subscribe((params) => {
            let newRoute = this._router.routerState.snapshot.url;
            if (newRoute != this.currentRoute) {
                this.ngOnInit();
            }
        });
    }

    loadProducts(event: any = null) {
        let loadPageForm = {
            pageIndex: event ? event.first / event.rows + 1 : 1,
            pageSize: event ? event.rows : 8,
        };

        event ? (this.getPageNumber = event.first / event.rows + 1) : (this.first = 0);

        this._apiServices.getPageInfor.subscribe((res) => {
            this.setPageNumber = res;
        });

        if (!event && this.setPageNumber) {
            loadPageForm = {
                pageIndex: this.setPageNumber,
                pageSize: event ? event.rows : 8,
            };

            this._apiServices.loadPages(loadPageForm, `/${this.categoryId}/product`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.products = res.data;
                this.first = (this.setPageNumber - 1) * 8;
                this.getPageNumber = this.setPageNumber;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, `/${this.categoryId}/product`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.products = res.data;
            });
        }
    }

    productDetail(productId: any) {
        this._router.navigate(['/product/detail'], {
            queryParams: { id: productId },
        });
    }
}
