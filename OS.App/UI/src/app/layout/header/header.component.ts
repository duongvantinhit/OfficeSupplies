import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

    accountMenu = [
        {
            label: 'Đăng nhập',
            icon: 'pi pi-sign-in',
            routerLink: 'login',
            command: () => {},
        },
        {
            label: 'Đăng ký',
            icon: 'pi pi-user-plus',
            routerLink: 'sign-up',
            command: () => {},
        },
    ];

    categoryMenu = [
        {
            label: 'Giấy',
            command: () => {},
        },
        {
            label: 'Bàn phím',
            command: () => {},
        },
        {
            label: 'Màn hình laptop',
            command: () => {},
        },
        {
            label: 'Chuột gaming',
            command: () => {},
        },
        {
            label: 'Lót chuột',
            command: () => {},
        },
        {
            label: 'Bàn phím',
            command: () => {},
        },
    ];

    cartVisible: boolean = false;
    accountVisible: boolean = false;
    categoryVisible: boolean = false;
}
