import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin/services/admin.service';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { decodeToken } from 'src/app/shared/helpers/jwt.helper';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-user-infor',
    templateUrl: './user-infor.component.html',
    styleUrls: ['./user-infor.component.scss'],
})
export class UserInforComponent implements OnInit {
    constructor(
        private _authServices: AuthService,
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _apiServices: AdminService,
    ) {}

    userInforForm: any;
    loading = false;
    currentUser: any;

    ngOnInit() {
        this.currentUser = this._authServices.currentUser();

        this.userInforForm = this._fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required]],
        });

        this.setValue(this.currentUser);
    }

    setValue(data: any): void {
        this.userInforForm.setValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
        });
    }

    private lineLeadFormValidate(): any[] {
        const errorMessages = [];

        if (!this.userInforForm.controls?.firstName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên', Notice.messageEnter));
        }

        if (!this.userInforForm.controls?.lastName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Họ', Notice.messageEnter));
        }

        if (!this.userInforForm.controls?.email?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Email', Notice.messageEnter));
        }

        if (this.userInforForm.controls.email.errors?.email) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Đúng định dạng email', Notice.messageEnter));
        }

        if (!this.userInforForm.controls?.phoneNumber?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Số điện thoại', Notice.messageEnter));
        }

        return errorMessages;
    }

    edit() {
        let errorMessages = this.lineLeadFormValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }
    }
}
