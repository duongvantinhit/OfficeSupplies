import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    constructor(private _router: Router) {}
    ngOnInit(): void {}

    items = [
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
                    routerLink: '/admin/add-category',
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
                    routerLink: '/admin/add-product',
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
                    routerLink: '/admin/add-promotion',
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
                    routerLink: '/admin',
                },
                {
                    label: 'Cập nhật trạng thái',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: '/admin',
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
                {
                    label: 'Tạo mới',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: '/admin/create-user',
                },
            ],
        },
        {
            label: 'Thống kê',
            icon: 'pi pi-fw pi-chart-line',
            items: [
                {
                    label: 'Tổng quan',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: '/admin',
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
                    label: 'Chỉnh sửa thông tin',
                    icon: 'pi pi-fw pi-user-edit',
                    routerLink: '/admin',
                },
                {
                    label: 'Đổi mật khẩu',
                    icon: 'pi pi-fw pi-refresh',
                    routerLink: '/admin/change-password',
                },
                {
                    label: 'Đăng xuất',
                    icon: 'pi pi-fw pi-sign-out',
                    routerLink: '/admin',
                },
            ],
        },
    ];
}
