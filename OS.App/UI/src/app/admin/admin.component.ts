import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
        private _authServices: AuthService,
        private _confirmationService: ConfirmationService,
        private _notiService: NotificationService,
    ) {}

    currentUser: any;

    ngOnInit(): void {
        this.currentUser = this._authServices.currentUser();
    }

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
            label: 'Người dùng',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Người dùng',
                    icon: 'pi pi-user',
                    routerLink: '/admin/users',
                },
                {
                    label: 'Thêm người dùng',
                    icon: 'pi pi-user-plus',
                    routerLink: '/admin/sign-up',
                },
            ],
        },
        {
            label: 'Đơn hàng',
            icon: 'pi pi-fw pi-cart-plus',
            routerLink: '/admin/orders',
        },
        {
            label: 'Thống kê',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: '/admin/statistics',
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
                this._confirmationService.confirm({
                    message: AppMessages.C_M_21,
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
    ];
}
