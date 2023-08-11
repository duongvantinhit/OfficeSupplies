import { Component, OnInit } from '@angular/core';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { Consts } from 'src/app/shared/const/consts';
import { ConfirmationService } from 'primeng/api';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-order-status',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
    constructor(
        private _apiServices: OfficeSuppliesService,
        private _confirmationService: ConfirmationService,
        private _notiService: NotificationService,
    ) {}

    orderAll: any;
    statusHeader = Consts.orderStatus;

    ngOnInit() {
        this.loadData();
    }

    loadData(status = 'all'): void {
        this._apiServices.getDataAll(`/orders/user/${status}`).subscribe((res) => {
            this.orderAll = res.data;
        });
    }

    cancelled(item: any): void {
        this._apiServices.getData('/order/status', 'Hủy').subscribe((res) => {
            let updateForm = {
                OrderStatusId: res.data.id,
            };

            this._confirmationService.confirm({
                message: AppMessages.C_M_23,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._apiServices.putData('/order/status', updateForm, item.id).subscribe((res) => {
                        if (res.successed) {
                            this._notiService.success(Notice.cancelledSuccessed, '', 'Thành công');
                            this.loadData('awaitingConfirmation');
                        } else {
                            this._notiService.error(Notice.err);
                        }
                    });
                },
            });
        });
    }

    changeTab(e: any): void {
        switch (e.index) {
            case 0:
                this._apiServices.sendPurchaseStatus('all');
                this.loadData('all');
                break;
            case 1:
                this._apiServices.sendPurchaseStatus('awaitingConfirmation');
                this.loadData('awaitingConfirmation');
                break;
            case 2:
                this._apiServices.sendPurchaseStatus('shipping');
                this.loadData('shipping');
                break;
            case 3:
                this._apiServices.sendPurchaseStatus('inTransit');
                this.loadData('inTransit');
                break;
            case 4:
                this._apiServices.sendPurchaseStatus('completed');
                this.loadData('completed');
                break;
            case 5:
                this._apiServices.sendPurchaseStatus('cancelled');
                this.loadData('cancelled');
                break;
        }
    }
}
