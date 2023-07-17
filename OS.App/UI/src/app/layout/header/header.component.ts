import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor(private _authServices: AuthService) {}

    login = false;
    accountMenu: any;
    cartVisible: boolean = false;
    accountVisible: boolean = false;
    categoryVisible: boolean = false;

    ngOnInit() {
        this.login = this._authServices.isLoggedIn();
        if (!this.login) {
            this.accountMenu = [
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
        } else {
            this.accountMenu = [
                {
                    label: 'Đăng xuất',
                    icon: 'pi pi-sign-in',
                    routerLink: 'login',
                    command: () => {
                        this._authServices.logout();
                    },
                },
                {
                    label: 'Thông tin tài khoản',
                    icon: 'pi pi-user-plus',
                    routerLink: 'user-infor',
                    command: () => {},
                },
            ];
        }
    }

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
}
