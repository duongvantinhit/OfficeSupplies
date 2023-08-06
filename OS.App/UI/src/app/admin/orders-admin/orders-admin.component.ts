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
    currentTab = 0;
    first = 0;
    totalRecords: number = 0;
    getPageNumber = 1;
    setPageNumber: any;
    currentPage = 'all';

    ngOnInit() {
        this.loadData();
        this.updateOrderStatusForm = this._fb.group({
            status: ['', [Validators.required]],
        });
        this._apiServices.getDataAll('/order/status').subscribe((res) => {
            this.orderStatus = res.data;
        });
    }

    loadData(event: any = null, status = 'all') {
        let loadPageForm = {
            pageIndex: event ? event.first / event.rows + 1 : 1,
            pageSize: event ? event.rows : 8,
        };

        if (!event) {
            this.first = 0;
            this._apiServices.loadPages(loadPageForm, `/orders/${status}`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.orderAll = res.data;
                this.first = 0;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, `/orders/${this.currentPage}`).subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.orderAll = res.data;
            });
        }
    }

    changeTab(e: any): void {
        switch (e.index) {
            case 0:
                this._apiServices.sendPurchaseStatus('all');
                this.loadData(null, 'all');
                this.currentTab = 0;
                this.currentPage = 'all';
                break;
            case 1:
                this._apiServices.sendPurchaseStatus('awaitingConfirmation');
                this.loadData(null, 'awaitingConfirmation');
                this.currentTab = 1;
                this.currentPage = 'awaitingConfirmation';
                break;
            case 2:
                this._apiServices.sendPurchaseStatus('shipping');
                this.loadData(null, 'shipping');
                this.currentTab = 2;
                this.currentPage = 'shipping';
                break;
            case 3:
                this._apiServices.sendPurchaseStatus('inTransit');
                this.loadData(null, 'inTransit');
                this.currentTab = 3;
                this.currentPage = 'inTransit';
                break;
            case 4:
                this._apiServices.sendPurchaseStatus('completed');
                this.loadData(null, 'completed');
                this.currentTab = 3;
                this.currentPage = 'completed';
                break;
            case 5:
                this._apiServices.sendPurchaseStatus('cancelled');
                this.loadData(null, 'cancelled');
                this.currentTab = 4;
                this.currentPage = 'cancelled';
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

    reloadData() {
        switch (this.currentTab) {
            case 0:
                this.loadData(null, 'all');
                break;
            case 1:
                this.loadData(null, 'awaitingConfirmation');
                break;
            case 2:
                this.loadData(null, 'shipping');
                break;
            case 3:
                this.loadData(null, 'inTransit');
                break;
            case 4:
                this.loadData(null, 'completed');
                break;
            case 5:
                this.loadData(null, 'cancelled');
                break;
        }
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
                        this.reloadData();
                    } else {
                        this._notiService.error(Notice.err);
                    }
                });
            },
        });
    }
}
