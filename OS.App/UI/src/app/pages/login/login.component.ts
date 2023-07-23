import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(
        private _fb: FormBuilder,
        private _authServices: AuthService,
        private _notiService: NotificationService,
        private _router: Router,
    ) {}

    loginForm: any;
    loading = false;

    ngOnInit() {
        this.loginForm = this._fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];

        if (!this.loginForm.controls?.email?.value) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Email', Notice.messageEnter));
        }

        if (this.loginForm.controls.email.errors?.email) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Đúng định dạng Email', Notice.messageEnter));
        }

        if (!this.loginForm.controls?.password?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Mật khẩu', Notice.messageEnter));
        }

        return errorMessages;
    }

    login() {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this.loading = true;

        this._authServices.postData('/sign-in', this.loginForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.loginSuccessed, '', 'Thành công');
                this._authServices.getUserInfor().subscribe((res) => {
                    localStorage.setItem('OS_CURRENT_USER', JSON.stringify(res.data));
                    let roles = this._authServices.currentUser().roles;
                    if (roles.indexOf('admin') !== -1 || roles.indexOf('employee')) {
                        this._router.navigate(['/admin']);
                    } else {
                        this._router.navigate(['']);
                    }
                });

                this.loading = false;
            } else {
                this._notiService.error(Notice.loginFail);
                this.loading = false;
            }
        });
    }
}
