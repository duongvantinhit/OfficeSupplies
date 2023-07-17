import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    ngOnInit() {
        this.loginForm = this._fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    login() {
        this._authServices.login('/SigIn', this.loginForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.loginSucceed, '', 'Thành công');
                this._authServices.setAccessToken(res.data.accessToken);
                this._authServices.setRefreshToken(res.data.refreshToken);
                this._router.navigate(['']);
            } else {
                this._notiService.error(Notice.loginFail);
            }
        });
    }
}
