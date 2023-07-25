import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OfficeSuppliesService } from 'src/app/office-supplies/services/office-supplies.service';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    constructor(
        private _authServices: AuthService,
        private cdr: ChangeDetectorRef,
        private _confirmationService: ConfirmationService,
        private _notiService: NotificationService,
        private _router: Router,
        private _apiServices: OfficeSuppliesService,
    ) {}

    login = false;
    cartVisible: boolean = false;
    accountVisible: boolean = false;
    categoryVisible: boolean = false;
    categories: any;

    accountMenu = [
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-in',
            command: () => {
                this._confirmationService.confirm({
                    message: AppMessages.C_M_3,
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this._router.navigate(['/login']);
                        this._authServices.logout();
                        this._notiService.success(Notice.logoutSuccessed, '', 'Thành công');
                    },
                });
            },
        },
        {
            label: 'Thông tin tài khoản',
            icon: 'pi pi-user-plus',
            routerLink: 'user-infor',
            command: () => {},
        },
    ];

    ngOnInit() {
        this.login = this._authServices.isLoggedIn();
        this._apiServices.getDataAll('/categories/name').subscribe((res) => {
            this.categories = res.data;
        });
    }

    product(item: any) {
        this._router.navigate(['/category'], {
            queryParams: { id: item.id, name: item.categoryName },
        });
    }

    onMouseEnter(type: any) {
        switch (type) {
            case 'category':
                this.categoryVisible = true;
                this.cdr.detectChanges();
                break;
            case 'cart':
                this.cartVisible = true;
                this.cdr.detectChanges();
                break;
        }
    }

    onMouseLeave(type: any) {
        switch (type) {
            case 'category':
                this.categoryVisible = false;
                this.cdr.detectChanges();
                break;
            case 'cart':
                this.cartVisible = false;
                this.cdr.detectChanges();
                break;
        }
    }
}
