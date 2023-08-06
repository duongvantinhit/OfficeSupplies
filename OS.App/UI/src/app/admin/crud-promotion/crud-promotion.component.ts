import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdminService } from '../services/admin.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-crud-promotion',
    templateUrl: './crud-promotion.component.html',
    styleUrls: ['./crud-promotion.component.scss'],
})
export class CrudPromotionComponent implements OnInit {
    constructor(
        private _actRoute: ActivatedRoute,
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _apiServices: AdminService,
        private _location: Location,
    ) {}

    pageTilte: any;
    promotionId: any;
    pageType: any;
    pageNumber: any;
    promotionForm: any;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;
        this.promotionId = route['id'];
        this.pageType = route['type'];
        this.pageNumber = route['page'];
        this.pageType === 'edit'
            ? (this.pageTilte = 'Chỉnh sửa mã khuyến mãi')
            : (this.pageTilte = 'Thêm mã khuyến mãi');

        this.promotionForm = this._fb.group({
            promotionName: ['', [Validators.required]],
            startDate: [new Date(), [Validators.required]],
            endDate: [new Date(), [Validators.required]],
            promotionDescription: ['', [Validators.required]],
            discountPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            createdDate: [new Date(), [Validators.required]],
            modifiedDate: [new Date(), [Validators.required]],
        });

        if (this.pageType) {
            this._apiServices.getData('/promotion', this.promotionId).subscribe((res) => {
                this.setValue(res.data);
            });
        }
    }

    setValue(data: any): void {
        this.promotionForm.patchValue({
            promotionName: data.promotionName,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            promotionDescription: data.promotionDescription,
            discountPercent: data.discountPercent,
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];

        if (!this.promotionForm.controls?.promotionName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên mã khuyến mãi', Notice.messageEnter));
        }

        if (!this.promotionForm.controls?.startDate?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Thời gian áp dụng', Notice.messageEnter));
        }

        if (!this.promotionForm.controls?.endDate?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Thời gian kết thúc', Notice.messageEnter));
        }

        if (!this.promotionForm.controls?.promotionDescription?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mô tả', Notice.messageEnter));
        }

        if (!this.promotionForm.controls?.discountPercent?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Phần trăm khuyến mãi', Notice.messageEnter));
        }

        return errorMessages;
    }

    create(): void {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this._apiServices.postData('/promotion', this.promotionForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.addSuccessed, '', 'Thành công');
                this.ngOnInit();
            } else {
                this._notiService.error(Notice.addFail);
            }
        });
    }

    edit(): void {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this._apiServices.putData('/promotion', this.promotionForm.value, this.promotionId).subscribe((res) => {
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
