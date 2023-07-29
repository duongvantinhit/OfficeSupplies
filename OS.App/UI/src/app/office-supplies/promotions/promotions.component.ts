import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AdminService } from 'src/app/admin/services/admin.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent implements OnInit {
    constructor(
        private _apiServices: AdminService,
        private _router: Router,
        private _confirmationService: ConfirmationService,
        private _notiService: NotificationService,
    ) {}

    first = 0;
    totalRecords: number = 0;
    getPageNumber = 1;
    setPageNumber: any;
    promotions: any;

    ngOnInit() {
        this.loadPromotions();
    }

    loadPromotions(event: any = null): void {
        let loadPageForm = {
            pageIndex: event ? event.first / event.rows + 1 : 1,
            pageSize: event ? event.rows : 9,
        };

        event ? (this.getPageNumber = event.first / event.rows + 1) : (this.first = 0);

        this._apiServices.getPageInfor.subscribe((res) => {
            this.setPageNumber = res;
        });

        if (!event && this.setPageNumber) {
            loadPageForm = {
                pageIndex: this.setPageNumber,
                pageSize: event ? event.rows : 9,
            };

            this._apiServices.loadPages(loadPageForm, '/promotions').subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.promotions = res.data;
                this.first = (this.setPageNumber - 1) * 9;
                this.getPageNumber = this.setPageNumber;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, '/promotions').subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.promotions = res.data;
            });
        }
    }
}
