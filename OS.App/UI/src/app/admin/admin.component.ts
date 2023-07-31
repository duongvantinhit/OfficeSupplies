import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './services/admin.service';
import { AuthService } from 'src/auth/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { AppMessages } from '../shared/const/messages.const';
import { NotificationService } from '../shared/services/notification.service';
import { Notice } from '../shared/const/notice.const';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    constructor(
        private _router: Router,
        private _apiServices: AdminService,
        private _authServices: AuthService,
        private _confirmationService: ConfirmationService,
        private _notiService: NotificationService,
    ) {}
    ngOnInit(): void {}

    function = [
        {
            label: 'Danh mục',
            icon: 'pi pi-fw pi-box',
            items: [
                {
                    label: 'Danh mục sản phẩm',
                    icon: 'pi pi-fw pi-list',
                    routerLink: '/admin/categories',
                },
                {
                    label: 'Thêm danh mục',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: '/admin/category',
                },
            ],
        },
        {
            label: 'Sản phẩm',
            icon: 'pi pi-fw pi-shopping-bag',
            items: [
                {
                    label: 'Danh sách sản phẩm',
                    icon: 'pi pi-fw pi-list',
                    routerLink: '/admin/products',
                },
                {
                    label: 'Thêm sản phẩm',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: '/admin/product',
                },
            ],
        },
        {
            label: 'Khuyến mãi',
            icon: 'pi pi-fw pi-ticket',
            items: [
                {
                    label: 'Danh sách mã',
                    icon: 'pi pi-fw pi-list',
                    routerLink: '/admin/promotions',
                },
                {
                    label: 'Thêm mã',
                    icon: 'pi pi-fw pi-ticket',
                    routerLink: '/admin/promotion',
                },
            ],
        },
        {
            label: 'Đơn hàng',
            icon: 'pi pi-fw pi-cart-plus',
            items: [
                {
                    label: 'Đơn hàng',
                    icon: 'pi pi-fw pi-cart-plus',
                    routerLink: '/admin/orders',
                },
            ],
        },
        {
            label: 'Người dùng',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Danh sách người dùng',
                    icon: 'pi pi-fw  pi-list',
                    routerLink: '/admin/users',
                },
            ],
        },
        {
            label: 'Thống kê',
            icon: 'pi pi-fw pi-chart-line',
            items: [
                {
                    label: 'Doanh thu',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: '/admin/statistics',
                },
                {
                    label: 'Ngày',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: '/admin',
                },
                {
                    label: 'Tháng',
                    icon: 'pi pi-fw pi-calendar-minus',
                    routerLink: '/admin',
                },
            ],
        },
        {
            label: 'Tài khoản của tôi',
            icon: 'pi pi-fw pi-lock',
            items: [
                {
                    label: 'Hồ sơ',
                    icon: 'pi pi-fw pi-info-circle',
                    routerLink: '/admin/user-infor',
                },
                {
                    label: 'Đổi mật khẩu',
                    icon: 'pi pi-fw pi-refresh',
                    routerLink: '/admin/change-password',
                },
                {
                    label: 'Đăng xuất',
                    icon: 'pi pi-fw pi-sign-out',
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
            ],
        },
    ];
}
