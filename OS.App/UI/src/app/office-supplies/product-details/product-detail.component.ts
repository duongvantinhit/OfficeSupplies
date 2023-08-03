import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Location } from '@angular/common';

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
        private _notiService: NotificationService,
        private _location: Location,
    ) {}

    productId: any;
    product: any;
    quantity: number = 1;
    currentRoute: any;
    fromProductPage: boolean | undefined;
    pageNumber: any;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;
        this.productId = route['id'];
        this.pageNumber = route['page'];

        this._apiServices.getData('/product', this.productId).subscribe((res) => {
            this.product = res.data;
        });

        this.currentRoute = this._router.routerState.snapshot.url;
        this._actRoute.queryParams.subscribe((params) => {
            let newRoute = this._router.routerState.snapshot.url;
            if (newRoute != this.currentRoute) {
                this.ngOnInit();
            }
        });

        window.addEventListener('popstate', this.onBackButtonClicked.bind(this));
    }

    addProductToCart() {
        let cartForm = {
            UserId: this.productId,
            ProductId: this.productId,
            Quantity: this.quantity,
        };

        this._apiServices.postData('/cart', cartForm).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.addSuccessed, '', 'Thành công');
                this.ngOnInit();
                this._apiServices.sendUpdateCarts('addSuccessed');
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }

    checkout() {
        this._router.navigate(['/checkout'], {
            queryParams: { id: this.productId, quantity: this.quantity },
        });
    }

    ngOnDestroy() {
        window.removeEventListener('popstate', this.onBackButtonClicked.bind(this));
    }

    onBackButtonClicked(event: any) {
        this._apiServices.sendPageInfor(this.pageNumber);
    }
}
