import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OfficeSuppliesService } from 'src/app/office-supplies/services/office-supplies.service';
import { Consts } from 'src/app/shared/const/consts';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-orders-admin',
    templateUrl: './orders-admin.component.html',
    styleUrls: ['./orders-admin.component.scss'],
})
export class OrdersAdminComponent implements OnInit {
    constructor(
        private _router: Router,
        private _apiServices: OfficeSuppliesService,
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _confirmationService: ConfirmationService,
    ) {}

    orderAll: any;
    statusHeader = Consts.orderStatus;
    visibleOrderDetail = false;
    orderDetail: any;
    visibleUpdate = false;
    updateOrderStatusForm: any;
    orderStatus: any;
    orderId: any;

    ngOnInit() {
        this.loadData();
        this.updateOrderStatusForm = this._fb.group({
            status: ['', [Validators.required]],
        });
        this._apiServices.getDataAll('/order/status').subscribe((res) => {
            console.log(res);
            this.orderStatus = res.data;
        });
    }

    loadData(status = 'all') {
        this._apiServices.getDataAll(`/orders/${status}`).subscribe((res) => {
            this.orderAll = res.data;
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

    showDialog(item: any) {
        this.orderDetail = item;
        this.visibleOrderDetail = true;
    }

    private formValidate(): any[] {
        const errorMessages = [];
        if (!this.updateOrderStatusForm.controls?.status?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Trạng thái', Notice.messageChoose));
        }

        return errorMessages;
    }

    showDialogUpdate(item: any, event: any) {
        event.stopPropagation();
        this.setValue(item);
        this.visibleUpdate = true;
        this.orderId = item.id;
    }

    setValue(data: any): void {
        this.updateOrderStatusForm.patchValue({
            status: data.orderStatusId,
        });
    }

    updateOrderStatus() {
        this.visibleUpdate = false;
        let errorMessages = this.formValidate();
        let updateForm = {
            OrderStatusId: this.updateOrderStatusForm.value.status,
        };
        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }
        this._confirmationService.confirm({
            message: AppMessages.C_M_20,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._apiServices.putData('/order/status', updateForm, this.orderId).subscribe((res) => {
                    if (res.successed) {
                        this._notiService.success(Notice.updateSuccessed, '', 'Thành công');
                        this.loadData();
                    } else {
                        this._notiService.error(Notice.err);
                    }
                });
            },
        });
    }
}
