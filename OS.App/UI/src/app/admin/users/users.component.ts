import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from 'src/auth/services/auth.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    constructor(private _authServices: AuthService) {}

    users: any;
    visible = true;
    roles: any;
    userId: any;
    userRoles: any;

    showDialog(user: any) {
        this.visible = true;
        this.userId = user.id;
        console.log(user.id);
    }

    userAuthorization() {}

    ngOnInit() {
        this._authServices.getDataAll('/users').subscribe((res) => {
            this.users = res.data;
        });

        this._authServices.getDataAll('/roles').subscribe((res) => {
            this.roles = res.data;
        });
    }
}
