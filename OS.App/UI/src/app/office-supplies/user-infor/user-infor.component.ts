import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
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
        private _router: Router,
    ) {}

    userInforForm: any;
    loading = false;
    currentPage: any;
    visibleEdit = false;
    userInfor: any;
    password: any;

    ngOnInit() {
        this._authServices.getUserInfor().subscribe((res) => {
            this.setValue(res.data);
            this.userInfor = res.data;
        });

        this.userInforForm = this._fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required]],
            address: ['', [Validators.required]],
        });

        this._router.routerState.snapshot.url.includes('admin') ? (this.currentPage = 'admin') : null;
    }

    setValue(data: any): void {
        this.userInforForm.setValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
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

        if (!this.userInforForm.controls?.address?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Địa chỉ', Notice.messageEnter));
        }

        return errorMessages;
    }

    edit(): void {
        let formCheckPassword = {
            password: this.password,
        };

        this._authServices.postData('/check-password', formCheckPassword).subscribe((res) => {
            if (res.successed) {
                let errorMessages = this.lineLeadFormValidate();

                if (errorMessages.length > 0) {
                    this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
                    return;
                }

                this._authServices.putData('/change-user/infor', this.userInforForm.value, '').subscribe((res) => {
                    if (res.successed) {
                        this._notiService.success(Notice.updateSuccessed, '', 'Thành công');
                        this.visibleEdit = false;
                        this.ngOnInit();
                    } else {
                        this._notiService.error(Notice.err);
                    }
                });
            } else {
                this._notiService.error(Notice.wrongPassword);
            }
        });
    }

    changePassword(): void {
        if (this.currentPage == 'admin') {
            this._router.navigate(['/admin/change-password']);
        } else {
            this._router.navigate(['/change-password']);
        }
    }
}
