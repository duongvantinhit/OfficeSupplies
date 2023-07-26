import { Component, OnInit } from '@angular/core';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-carts',
    templateUrl: './carts.component.html',
    styleUrls: ['./carts.component.scss'],
})
export class CartsComponent implements OnInit {
    constructor(
        private _apiServices: OfficeSuppliesService,
        private _confirmationService: ConfirmationService,
        private _notiService: NotificationService,
        private _router: Router,
    ) {}

    carts: any;
    totalPrice: any;
    value1: number = 1;

    ngOnInit() {
        this._apiServices.getDataAll('/carts').subscribe((res) => {
            this.carts = res.data;
            this.updateCart(res.data);
        });
    }

    updateCart(item: any, id: any = null, quantity: any = null) {
        this.totalPrice = this.carts.reduce((acc: any, cur: any) => acc + cur.price * cur.quantity, 0);
        console.log(id, quantity);
        if (id && quantity) {
            this._apiServices.putData('/cart', { quantity: quantity }, id).subscribe((res) => {
                if (!res.successed) {
                    this._notiService.error(Notice.addFail);
                }
            });
        }
    }

    productDetail(productId: any) {
        this._router.navigate(['/product/detail'], {
            queryParams: { id: productId },
        });
    }

    deleteCart(id: any, event: any) {
        event.stopPropagation();

        this._confirmationService.confirm({
            message: AppMessages.C_M_1,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._apiServices.deleteData('/cart', id).subscribe((res) => {
                    if (res.successed) {
                        this.ngOnInit();
                        this._notiService.success(Notice.deleteSuccessed, '', 'Thành công');
                        this._apiServices.sendUpdateCarts('deleteSuccessed');
                    } else {
                        this._notiService.error(Notice.addFail);
                    }
                });
            },
        });
    }
}
