import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfficeSuppliesService } from '../services/office-supplies.service';

@Component({
    selector: 'app-order-status',
    templateUrl: './order-status.component.html',
    styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit {
    constructor(private _apiServices: OfficeSuppliesService, private _router: Router) {}
    orderAll: any;
    ngOnInit() {
        this._apiServices.getDataAll('/orders/user').subscribe((res) => {
            console.log(res);
            this.orderAll = res.data;
        });
    }
}
