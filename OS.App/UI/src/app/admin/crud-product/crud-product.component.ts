import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Location } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { Consts } from 'src/app/shared/const/consts';

@Component({
    selector: 'app-add-product',
    templateUrl: './crud-product.component.html',
    styleUrls: ['./crud-product.component.scss'],
})
export class CrudProductComponent implements OnInit {
    constructor(
        private _fb: FormBuilder,
        private _actRoute: ActivatedRoute,
        private _notiService: NotificationService,
        private _location: Location,
        private _apiServices: AdminService,
    ) {}

    productForm: any;
    pageType: any;
    pageTilte: any;
    uploadImg: any;
    imgName: any;
    productStatus = Consts.productStatus;
    categorie: any;
    productId: any;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;

        this.pageType = route['type'];
        this.productId = route['id'];
        this.pageType === 'edit' ? (this.pageTilte = 'Chỉnh sửa sản phẩm') : (this.pageTilte = 'Thêm sản phẩm');

        this._apiServices.getDataAll('/categories').subscribe((res) => {
            this.categorie = res.data;
        });

        this.productForm = this._fb.group({
            productName: ['', [Validators.required]],
            quantityInStock: ['', [Validators.required]],
            categoryId: ['', [Validators.required]],
            trademark: ['', [Validators.required]],
            productDescription: ['', [Validators.required]],
            price: ['', [Validators.required]],
            status: ['', [Validators.required]],
            countryOfOrigin: ['', [Validators.required]],
            warranty: ['', [Validators.required]],
            warrantyDescription: ['', [Validators.required]],
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];

        if (!this.productForm.controls?.productName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên sản phẩm', Notice.messageEnter));
        }

        if (!this.productForm.controls?.quantityInStock?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Số lượng', Notice.messageEnter));
        }

        if (!this.productForm.controls?.categoryId?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Danh mục', Notice.messageChoose));
        }

        if (!this.productForm.controls?.trademark?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Thương hiệu', Notice.messageEnter));
        }

        if (!this.productForm.controls?.productDescription?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mô tả sản phẩm', Notice.messageEnter));
        }

        if (!this.productForm.controls?.price?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Giá', Notice.messageEnter));
        }

        if (!this.productForm.controls?.status?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Trạng thái', Notice.messageChoose));
        }

        if (!this.productForm.controls?.countryOfOrigin?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Xuất xứ', Notice.messageEnter));
        }

        if (!this.productForm.controls?.warranty?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Thời gian bảo hành', Notice.messageEnter));
        }

        if (!this.productForm.controls?.warrantyDescription?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mô tả bảo hành', Notice.messageEnter));
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

    onUpload(event: any): void {}

    goBack(): void {
        this._location.back();
    }

    create(): void {
        const formUploadImg: FormData = new FormData();
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }
        debugger;

        formUploadImg.append('file', this.uploadImg, this.uploadImg.name);
        formUploadImg.append('ProductName', this.productForm.controls.productName.value);
        formUploadImg.append('QuantityInStock', this.productForm.controls.quantityInStock.value);
        formUploadImg.append('CategoryId', this.productForm.controls.categoryId.value);
        formUploadImg.append('Trademark', this.productForm.controls.trademark.value);
        formUploadImg.append('ProductDescription', this.productForm.controls.productDescription.value);
        formUploadImg.append('Price', this.productForm.controls.price.value);
        formUploadImg.append('Status', this.productForm.controls.status.value);
        formUploadImg.append('CountryOfOrigin', this.productForm.controls.countryOfOrigin.value);
        formUploadImg.append('Warranty', this.productForm.controls.warranty.value);
        formUploadImg.append('WarrantyDescription', this.productForm.controls.warrantyDescription.value);
        formUploadImg.append('CreatedDate', new Date().toISOString());

        this._apiServices.postData('/product', formUploadImg).subscribe((res) => {
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

        formUploadImg.append('ProductName', this.productForm.controls.productName.value);
        formUploadImg.append('QuantityInStock', this.productForm.controls.quantityInStock.value);
        formUploadImg.append('CategoryId', this.productForm.controls.categoryId.value);
        formUploadImg.append('Trademark', this.productForm.controls.trademark.value);
        formUploadImg.append('ProductDescription', this.productForm.controls.productDescription.value);
        formUploadImg.append('Price', this.productForm.controls.price.value);
        formUploadImg.append('Status', this.productForm.controls.status.value);
        formUploadImg.append('CountryOfOrigin', this.productForm.controls.countryOfOrigin.value);
        formUploadImg.append('Warranty', this.productForm.controls.warranty.value);
        formUploadImg.append('WarrantyDescription', this.productForm.controls.warrantyDescription.value);
        formUploadImg.append('ModifiedDate', new Date().toISOString());

        this._apiServices.putData('product', formUploadImg, this.productId).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.saveSuccessed, '', 'Thành công');
                this.ngOnInit();
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }
}
