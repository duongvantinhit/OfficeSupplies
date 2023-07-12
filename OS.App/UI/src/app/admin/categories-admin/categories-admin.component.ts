import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-categories-admin',
    templateUrl: './categories-admin.component.html',
    styleUrls: ['./categories-admin.component.scss'],
})
export class CategoriesAdminComponent implements OnInit {
    constructor(private _apiServices: AdminService, private _router: Router) {}

    first = 0;
    totalRecords: number = 0;
    getPageNumber: any;
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

        if (!event) {
            this.first = 0;
        } else {
            this.getPageNumber = event.first / event.rows + 1;
        }

        this._apiServices.getPageInfor.subscribe((res) => {
            this.setPageNumber = res;
            console.log(res);
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
        this._apiServices.deleteData('/categories', id).subscribe((res) => {
            this.ngOnInit();
        });
    }

    editCategory(id: any) {
        console.log(this.getPageNumber);
        this._router.navigate(['/admin/category'], {
            queryParams: { id: id, type: 'edit', page: this.getPageNumber },
        });
    }
}
