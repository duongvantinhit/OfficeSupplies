import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/services/auth.service';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
    constructor(
        private _authServices: AuthService,
        private _apiServices: OfficeSuppliesService,
        private _router: Router,
        private _actRoute: ActivatedRoute,
        private _notiService: NotificationService,
    ) {}

    userInfor: any;
    carts: any;
    voucher: any;
    subtotal: any;
    voucherVisible = false;
    discount = 0;
    selectedVoucher: any = null;
    totalCost: any;
    pageType: any;
    productId: any;
    product: any;
    quantity: any;
    userId: any;

    ngOnInit() {
        this.userInfor = this._authServices.currentUser();
        let route = this._actRoute.snapshot.queryParams;
        this.productId = route['id'];
        this.quantity = route['quantity'];

        this._apiServices.getDataAll('/promotions/available').subscribe((res) => {
            this.voucher = res.data;
        });

        if (this._router.routerState.snapshot.url.includes('quantity')) {
            this.pageType = 'payment for a product';
        }

        if (!this.pageType) {
            this._apiServices.getDataAll('/carts').subscribe((res) => {
                this.carts = res.data;
                this.subtotal = this.carts.reduce((acc: any, cur: any) => acc + cur.price * cur.quantity, 0);
                this.totalCost = this.subtotal;
            });
        } else {
            this._apiServices.getData('/product', this.productId).subscribe((res) => {
                this.carts = [
                    {
                        imageURL: res.data.imageURL,
                        productName: res.data.productName,
                        price: res.data.price,
                        quantity: this.quantity,
                        productId: res.data.id,
                    },
                ];

                this.subtotal = res.data.price * this.quantity;
                this.totalCost = this.subtotal;
            });
        }
    }

    showDialog() {
        this.voucherVisible = true;
    }

    apply() {
        this.voucherVisible = false;
        this.discount = (this.selectedVoucher.discountPercent / 100) * this.subtotal;
        this.totalCost = this.subtotal - this.discount;
    }

    order() {
        let promotionId = this.selectedVoucher ? this.selectedVoucher.id : null;
        let orderForm = {
            TotalCost: this.totalCost,
            OrderDate: new Date(),
            PromotionId: promotionId,
            OrderItems: this.carts,
        };

        this._apiServices.postData('/order', orderForm).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.checkOutSuccessed, '', 'Thành công');
                this.ngOnInit();
                this._apiServices.sendUpdateCarts('deleteSuccessed');
                this._router.navigate(['']);
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }
}
