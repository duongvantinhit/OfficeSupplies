import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfficeSuppliesService } from '../services/office-supplies.service';
import { Consts } from 'src/app/shared/const/consts';

@Component({
    selector: 'app-order-status',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
    constructor(private _router: Router, private _apiServices: OfficeSuppliesService) {}

    orderAll: any;
    statusHeader = Consts.orderStatus;

    ngOnInit() {
        this.loadData();
    }

    loadData(status = 'all') {
        this._apiServices.getDataAll(`/orders/user/${status}`).subscribe((res) => {
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
}
