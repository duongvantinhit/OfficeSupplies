import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-crud-category',
    templateUrl: './crud-category.component.html',
    styleUrls: ['./crud-category.component.scss'],
})
export class CrudCategoryComponent implements OnInit {
    constructor(
        private _router: Router,
        private _apiServices: AdminService,
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _actRoute: ActivatedRoute,
        private _location: Location,
    ) {}

    uploadImg: any;
    imgName: any;
    categoryForm: any;
    categoryData: any;
    categoryId: any;
    pageType: any;
    pageTilte: any;

    ngOnInit() {
        this.categoryForm = this._fb.group({
            categoryName: ['', [Validators.required]],
            categoryDescription: ['', [Validators.required]],
            createdByUserId: ['1', [Validators.required]],
            createdDate: [new Date(), [Validators.required]],
        });

        let route = this._actRoute.snapshot.queryParams;
        this.categoryId = route['id'];
        this.pageType = route['type'];

        this.pageType === 'edit' ? (this.pageTilte = 'Chỉnh sửa danh mục') : (this.pageTilte = 'Thêm danh mục');

        if (this.pageType) {
            this._apiServices.getData('/categories', this.categoryId).subscribe((res) => {
                console.log(res);
                this.setValue(res.data);
            });
        }
    }

    setValue(data: any): void {
        console.log(data.categoryName);
        this.categoryForm.patchValue({
            categoryName: data.categoryName,
            categoryDescription: data.categoryDescription,
        });
        this.imgName = data.imageURL;
    }

    private lineLeadFormValidate(): any[] {
        const errorMessages = [];

        if (!this.categoryForm.controls?.categoryName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên danh mục', Notice.messageEnter));
        }

        if (!this.categoryForm.controls?.categoryDescription?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mô tả danh mục', Notice.messageEnter));
        }

        if (!this.uploadImg) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Hình ảnh', Notice.messageChoose));
        }

        return errorMessages;
    }

    onFileSelected(event: any) {
        this.uploadImg = event.originalEvent.target.files[0];
        this.imgName = this.uploadImg.name;
    }

    onSubmit() {
        const formUploadImg: FormData = new FormData();
        let errorMessages = this.lineLeadFormValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        formUploadImg.append('file', this.uploadImg, this.uploadImg.name);
        formUploadImg.append('CategoryName', this.categoryForm.controls.categoryName.value);
        formUploadImg.append('CategoryDescription', this.categoryForm.controls.categoryDescription.value);
        formUploadImg.append('createdByUserId', this.categoryForm.controls.createdByUserId.value);
        formUploadImg.append('createdDate', new Date().toISOString());

        this._apiServices.postData('/categories', formUploadImg).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.addSuccced, '', 'Thành công');
                this.ngOnInit();
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }

    goBack() {
        this._location.back();
    }
}
