import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminService } from '../services/admin.service';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';

@Component({
    selector: 'app-promotions-admin',
    templateUrl: './promotions-admin.component.html',
    styleUrls: ['./promotions-admin.component.scss'],
})
export class PromotionsAdminComponent implements OnInit {
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
            pageSize: event ? event.rows : 8,
        };

        event ? (this.getPageNumber = event.first / event.rows + 1) : (this.first = 0);

        this._apiServices.getPageInfor.subscribe((res) => {
            this.setPageNumber = res;
        });

        if (!event && this.setPageNumber) {
            loadPageForm = {
                pageIndex: this.setPageNumber,
                pageSize: event ? event.rows : 8,
            };

            this._apiServices.loadPages(loadPageForm, '/promotions').subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.promotions = res.data;
                this.first = (this.setPageNumber - 1) * 8;
                this.getPageNumber = this.setPageNumber;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, '/promotions').subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.promotions = res.data;
            });
        }
    }

    deletePromotion(id: any, event: any): void {
        event.stopPropagation();

        this._confirmationService.confirm({
            message: AppMessages.C_M_22,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._apiServices.deleteData('/promotion', id).subscribe((res) => {
                    if (res.successed) {
                        this.ngOnInit();
                        this._notiService.success(Notice.deleteSuccessed, '', 'Thành công');
                    } else {
                        this._notiService.error(Notice.err);
                    }
                });
            },
        });
    }

    editPromotion(id: any): void {
        this._router.navigate(['/admin/promotion'], {
            queryParams: { id: id, type: 'edit', page: this.getPageNumber },
        });
    }
}
