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
    pageNumber: any;

    ngOnInit(): void {
        let route = this._actRoute.snapshot.queryParams;
        this.categoryId = route['id'];
        this.pageType = route['type'];
        this.pageNumber = route['page'];
        this.pageType === 'edit' ? (this.pageTilte = 'Chỉnh sửa danh mục') : (this.pageTilte = 'Thêm danh mục');

        if (this.pageType) {
            this._apiServices.getData('/categories', this.categoryId).subscribe((res) => {
                this.setValue(res.data);
            });
        }

        this.categoryForm = this._fb.group({
            categoryName: ['', [Validators.required]],
            categoryDescription: ['', [Validators.required]],
            createdByUserId: ['042f4f70-8fcc-4f41-9080-baab63f8099e', [Validators.required]],
            createdDate: [new Date(), [Validators.required]],
        });
    }

    setValue(data: any): void {
        this.categoryForm.patchValue({
            categoryName: data.categoryName,
            categoryDescription: data.categoryDescription,
        });
        this.imgName = data.imageURL;
    }

    private formValidate(): any[] {
        const errorMessages = [];

        if (!this.categoryForm.controls?.categoryName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên danh mục', Notice.messageEnter));
        }

        if (!this.categoryForm.controls?.categoryDescription?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mô tả danh mục', Notice.messageEnter));
        }

        if (!this.uploadImg && this.pageType != 'edit') {
            errorMessages.push(AppMessages.PLEASE_ENTER('Hình ảnh', Notice.messageChoose));
        }

        return errorMessages;
    }

    onFileSelected(event: any): void {
        this.uploadImg = event.originalEvent.target.files[0];
        this.imgName = this.uploadImg.name;
    }

    create(): void {
        const formUploadImg: FormData = new FormData();
        let errorMessages = this.formValidate();

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
                this._notiService.success(Notice.addSuccessed, '', 'Thành công');
                this.ngOnInit();
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }

    edit(): void {
        const formUploadImg: FormData = new FormData();
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        if (this.uploadImg) {
            formUploadImg.append('file', this.uploadImg, this.uploadImg.name);
        }

        formUploadImg.append('CategoryName', this.categoryForm.controls.categoryName.value);
        formUploadImg.append('CategoryDescription', this.categoryForm.controls.categoryDescription.value);
        formUploadImg.append('createdByUserId', this.categoryForm.controls.createdByUserId.value);
        formUploadImg.append('ModifiedDate', new Date().toISOString());

        this._apiServices.putData('/categories', formUploadImg, this.categoryId).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.saveSuccessed, '', 'Thành công');
                this.ngOnInit();
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }

    goBack(): void {
        this._location.back();
        this._apiServices.sendPageInfor(this.pageNumber);
    }
}
