import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    constructor(
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _authServices: AuthService,
        private _route: Router,
    ) {}

    changePasswordForm: any;

    ngOnInit() {
        this._authServices.getUserInfor().subscribe((res) => {
            this.changePasswordForm = this._fb.group({
                email: [res.data.email, [Validators.required, Validators.email]],
                oldPassword: ['', [Validators.required]],
                newPassword: ['', [Validators.required]],
                confirmNewPassword: ['', [Validators.required]],
            });
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];

        if (!this.changePasswordForm.controls?.oldPassword?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu cũ', Notice.messageEnter));
        }

        if (!this.changePasswordForm.controls?.newPassword?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu mới', Notice.messageEnter));
        }

        if (!this.changePasswordForm.controls?.confirmNewPassword?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Nhập lại mật khẩu mới', Notice.messageEnter));
        }

        if (
            this.changePasswordForm.controls?.confirmNewPassword?.value !=
            this.changePasswordForm.controls?.newPassword?.value
        ) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu không trùng khớp'));
        }

        return errorMessages;
    }

    changePassword(): void {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this._authServices.putData('/change-password', this.changePasswordForm.value, '').subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.saveSuccessed, '', 'Thành công');
                this._authServices.logout();
                this._route.navigate(['/login']);
            } else {
                this._notiService.error(Notice.err);
            }
        });
    }
}
