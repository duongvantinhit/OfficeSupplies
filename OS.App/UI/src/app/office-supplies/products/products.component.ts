import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { min } from 'rxjs-compat/operator/min';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
    constructor(
        private _apiServices: OfficeSuppliesService,
        private _router: Router,
        private _actRoute: ActivatedRoute,
    ) {}
    @ViewChild('op')
    op!: OverlayPanel;

    first = 0;
    totalRecords: number = 0;
    getPageNumber = 1;
    setPageNumber: any;
    products: any;
    pageType: any;
    showPrice: any = false;

    priceMin: any = 100000;
    priceMax: any = 10000000;
    rangeValues: number[] = [this.priceMin, this.priceMax];
    searchKeyValue: any;
    currentRoute: any;
    filter: any = false;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;
        this.searchKeyValue = route['search'];
        this.loadProducts();

        this.currentRoute = this._router.routerState.snapshot.url;
        this._actRoute.queryParams.subscribe((params) => {
            let newRoute = this._router.routerState.snapshot.url;
            if (newRoute != this.currentRoute) {
                this.ngOnInit();
                this.searchKeyValue = route['search'];
                console.log('change');
            }
        });
    }

    searchKey() {
        this._apiServices.getData('/search/product', this.searchKeyValue).subscribe((res) => {
            this.products = res.data;
            console.log(res.data);
        });
    }

    onRemoveApply() {
        this.op.toggle(true);
        this.showPrice = false;
        this.filter = false;
        this.loadProducts();
    }

    onApplyPrice() {
        this.showPrice = true;
        this.filter = true;
        this.op.toggle(true);

        if (this.pageType == 'search') {
            this._apiServices
                .getData('/search/product', this.searchKeyValue + '/' + this.priceMin + '/' + this.priceMax)
                .subscribe((res) => {
                    this.products = res.data;
                    console.log(res.data);
                });
        } else {
            this._apiServices.getData('/search/product', this.priceMin + '/' + this.priceMax).subscribe((res) => {
                this.products = res.data;
                console.log(res.data);
            });
        }
    }

    onKeyDownHandler(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }

        if (this.priceMax <= this.priceMin) this.priceMax = this.priceMin + 1000;

        if (this.priceMin < 0 || this.priceMin > 9999999 || this.priceMax < 0 || this.priceMax > 10000000) {
            event.preventDefault();
        }
    }

    setFilterPrice() {
        if (this.priceMax <= this.priceMin) this.priceMax = this.priceMin + 1000;
        this.rangeValues = [this.priceMin, this.priceMax];
    }

    setMinMaxFilter() {
        this.priceMin = this.rangeValues[0];
        this.priceMax = this.rangeValues[1];
    }

    loadProducts(event: any = null): void {
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

        if (this._router.routerState.snapshot.url.includes('cart')) {
            this.pageType = 'cart';
        }

        if (this._router.routerState.snapshot.url.includes('search')) {
            this.pageType = 'search';
            this.searchKey();
            return;
        }

        if (!event && this.setPageNumber) {
            loadPageForm = {
                pageIndex: this.setPageNumber,
                pageSize: event ? event.rows : 15,
            };

            this._apiServices.loadPages(loadPageForm, `/products/user`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.products = res.data;
                this.first = (this.setPageNumber - 1) * 15;
                this.getPageNumber = this.setPageNumber;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, `/products/user`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.products = res.data;
            });
        }
    }

    productDetail(productId: any): void {
        this._router.navigate(['/product/detail'], {
            queryParams: { id: productId, page: this.getPageNumber },
        });

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        //window.location.reload();
    }
}
