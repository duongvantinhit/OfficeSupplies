import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    constructor(
        private _authServices: AuthService,
        private _fb: FormBuilder,
        private _notiService: NotificationService,
        private _confirmationService: ConfirmationService,
    ) {}

    users: any;
    visible = false;
    roles: any;
    userId: any;
    userRoles: any;
    userAuthorizatonForm: any;

    ngOnInit() {
        this._authServices.getDataAll('/users').subscribe((res) => {
            this.users = res.data;
        });
    }

    showDialog(user: any): void {
        this.visible = true;
        this.userId = user.id;

        this.userAuthorizatonForm = this._fb.group({
            userId: [this.userId, [Validators.required]],
            role: ['', [Validators.required]],
        });

        this.loadData();
    }

    private loadData(): void {
        this._authServices.getData('/user/roles', this.userId).subscribe((res) => {
            this.userRoles = res.data;

            this._authServices.getDataAll('/roles').subscribe((res) => {
                this.roles = res.data;

                this.roles = this.userRoles
                    .filter((item: any) => !this.roles.includes(item))
                    .concat(this.roles.filter((item: any) => !this.userRoles.includes(item)));
            });
        });
    }

    private formValidate(): any[] {
        const errorMessages = [];
        if (!this.userAuthorizatonForm.controls?.role?.valid) {
            errorMessages.push(AppMessages.PLEASE_ENTER('Role', Notice.messageChoose));
        }

        return errorMessages;
    }

    userAuthorization(): void {
        let errorMessages = this.formValidate();

        if (errorMessages.length > 0) {
            this._notiService.error(errorMessages.join('<br/>'), 'ua-toast');
            return;
        }

        this._authServices.postData('/assign/user/role', this.userAuthorizatonForm.value).subscribe((res) => {
            if (res.successed) {
                this._notiService.success(Notice.addSuccessed, '', 'Thành công');
                this.loadData();
                this._authServices.getUserInfor().subscribe(async (res) => {
                    localStorage.setItem('OS_CURRENT_USER', JSON.stringify(res.data));
                });
            } else {
                this._notiService.error(Notice.err);
            }
        });
    }

    deleteUserRole(role: any): void {
        this._confirmationService.confirm({
            message: AppMessages.C_M_1,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._authServices.deleteData('/remove', `${this.userId}/${role}`).subscribe((res) => {
                    if (res.successed) {
                        this._notiService.success(Notice.deleteSuccessed, '', 'Thành công');
                        this.loadData();
                    } else {
                        this._notiService.error(Notice.err);
                    }
                });
            },
        });
    }
}
