import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
    constructor(
        private _authServices: AuthService,
        private _fb: FormBuilder,
        private _notiService: NotificationService,
    ) {}

    roles: any;
    createUserForm: any;

    ngOnInit() {
        this._authServices.getDataAll('/roles').subscribe((res) => {
            this.roles = res.data;
        });

        this.createUserForm = this._fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
            address: ['', [Validators.required]],
            role: ['', [Validators.required]],
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];
        if (!this.createUserForm.controls?.firstName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên', Notice.messageEnter));
        }

        if (!this.createUserForm.controls?.lastName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Họ', Notice.messageEnter));
        }

        if (!this.createUserForm.controls?.phoneNumber?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Số điện thoại', Notice.messageEnter));
        }

        if (!this.createUserForm.controls?.email?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Email', Notice.messageEnter));
        }

        if (this.createUserForm.controls.email.errors?.email) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Đúng định dạng Email', Notice.messageEnter));
        }

        if (!this.createUserForm.controls?.password?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu', Notice.messageEnter));
        }

        if (!this.createUserForm.controls?.confirmPassword?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Nhập lại mật khẩu', Notice.messageEnter));
        }

        if (this.createUserForm.controls?.confirmPassword?.value != this.createUserForm.controls?.password?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu không trùng khớp'));
        }

        if (!this.createUserForm.controls?.address?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Địa chỉ', Notice.messageEnter));
        }

        if (!this.createUserForm.controls?.role?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Loại tài khoản', Notice.messageChoose));
        }

        return errorMessages;
    }

    createUser() {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this._authServices.postData('/sign-up', this.createUserForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.addSuccessed, '', 'Thành công');
            } else {
                this._notiService.error(Notice.err);
            }
        });
    }
}
