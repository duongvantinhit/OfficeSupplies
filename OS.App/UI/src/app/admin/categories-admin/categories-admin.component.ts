import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Notice } from 'src/app/shared/const/notice.const';

@Component({
    selector: 'app-categories-admin',
    templateUrl: './categories-admin.component.html',
    styleUrls: ['./categories-admin.component.scss'],
})
export class CategoriesAdminComponent implements OnInit {
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
    categories: any;

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories(event: any = null): void {
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

            this._apiServices.loadPages(loadPageForm, '/categories').subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.categories = res.data;
                this.first = (this.setPageNumber - 1) * 8;
                this.getPageNumber = this.setPageNumber;
            });
        } else {
            this._apiServices.loadPages(loadPageForm, '/categories').subscribe((res) => {
                this.totalRecords = res?.totalRows;
                this.categories = res.data;
            });
        }
    }

    deleteCategory(id: any, event: any) {
        event.stopPropagation();

        this._confirmationService.confirm({
            message: AppMessages.C_M_1,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._apiServices.deleteData('/categories', id).subscribe((res) => {
                    this.ngOnInit();
                    this._notiService.success(Notice.deleteSuccessed, '', 'Thành công');
                });
            },
        });
    }

    editCategory(id: any) {
        this._router.navigate(['/admin/category'], {
            queryParams: { id: id, type: 'edit', page: this.getPageNumber },
        });
    }
}
