import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/services/auth.service';
import { OfficeSuppliesService } from '../services/office-supplies.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
    constructor(private _authServices: AuthService, private _apiServices: OfficeSuppliesService) {}

    userInfor: any;
    carts: any;
    voucher: any;
    subtotal: any;
    voucherVisible = false;
    discount = 0;
    selectedVoucher: any = null;
    totalCost: any;

    ngOnInit() {
        this.userInfor = this._authServices.currentUser();
        this._apiServices.getDataAll('/carts').subscribe((res) => {
            this.carts = res.data;
            this.subtotal = this.carts.reduce((acc: any, cur: any) => acc + cur.price * cur.quantity, 0);
            this.totalCost = this.subtotal;
        });
    }

    showDialog() {
        this.voucherVisible = true;
        this._apiServices.getDataAll('/promotions/available').subscribe((res) => {
            console.log(res.data);
            this.voucher = res.data;
        });
    }

    apply() {
        this.voucherVisible = false;
        console.log(this.selectedVoucher);
        this.discount = (this.selectedVoucher.discountPercent / 100) * this.subtotal;
        this.totalCost = this.subtotal - this.discount;
    }
}
