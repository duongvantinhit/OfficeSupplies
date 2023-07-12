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
    categories: any;

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories(event: any = null): void {
        let searchReq = {
            pageIndex: event ? event.first / event.rows + 1 : 1,
            pageSize: event ? event.rows : 8,
        };

        if (!event) {
            this.first = 0;
        }

        this._apiServices.loadPages(searchReq, '/categories').subscribe((res) => {
            this.totalRecords = res?.totalRows;
            this.categories = res.data;
        });
    }

    deleteCategory(id: any, event: any) {
        event.stopPropagation();
        this._apiServices.deleteData('/categories', id).subscribe((res) => {
            this.ngOnInit();
        });
    }

    editCategory(id: any) {
        this._router.navigate(['/admin/category'], {
            queryParams: { id: id, type: 'edit', page: 1 },
        });
    }
}
