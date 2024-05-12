import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
        private _actRoute: ActivatedRoute,
    ) {}

    loginForm: any;
    loading = false;
    prepage: any;

    ngOnInit() {
        let route = this._actRoute.snapshot.queryParams;
        this.prepage = route['returnUrl'];
        console.log('urre' + this.prepage);

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

    login(): void {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this.loading = true;
        this._authServices.postData('/sign-in', this.loginForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.loginSuccessed, '', 'Chào mừng bạn');
                this._authServices.getUserInfor().subscribe(async (res) => {
                    this._authServices.getUserInfor().subscribe((user) => {
                        if (!user.data.roles) {
                            this._router.navigate(['']);
                        } else {
                            const url = this.prepage;
                            if (url == '/' || url == undefined) this._router.navigate(['']);

                            if (url.includes('product/detail')) {
                                const urlParts = url.split('?');
                                const path = urlParts[0];
                                const queryParams = urlParts[1].split('&');
                                const idParam = queryParams.find((param: any) => param.startsWith('id='));
                                const idValue = idParam.split('=')[1];
                                this._router.navigate([path], {
                                    queryParams: { id: idValue },
                                });
                            } else {
                                this._router.navigate([url]);
                            }
                        }
                    });
                });

                this.loading = false;
            } else {
                this._notiService.error(Notice.loginFail);
                this.loading = false;
            }
        });
    }
}
