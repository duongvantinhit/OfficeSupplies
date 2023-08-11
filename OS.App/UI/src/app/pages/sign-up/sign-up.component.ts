import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    constructor(
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _authServices: AuthService,
    ) {}

    signUpForm: any;

    ngOnInit() {
        this.signUpForm = this._fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
            address: ['', [Validators.required]],
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];
        if (!this.signUpForm.controls?.firstName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Tên', Notice.messageEnter));
        }

        if (!this.signUpForm.controls?.lastName?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Họ', Notice.messageEnter));
        }

        if (!this.signUpForm.controls?.phoneNumber?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Số điện thoại', Notice.messageEnter));
        }

        if (!this.signUpForm.controls?.email?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Email', Notice.messageEnter));
        }

        if (this.signUpForm.controls.email.errors?.email) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Đúng định dạng Email', Notice.messageEnter));
        }

        if (!this.signUpForm.controls?.password?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu', Notice.messageEnter));
        }

        if (!this.signUpForm.controls?.confirmPassword?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Nhập lại mật khẩu', Notice.messageEnter));
        }

        if (this.signUpForm.controls?.confirmPassword?.value != this.signUpForm.controls?.password?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu không trùng khớp'));
        }

        if (!this.signUpForm.controls?.address?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Địa chỉ', Notice.messageEnter));
        }

        return errorMessages;
    }

    signUp(): void {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this._authServices.postData('/sign-up', this.signUpForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.signUpSuccessed, '', 'Thành công');
            } else {
                this._notiService.error(Notice.err);
            }
        });
    }
}
