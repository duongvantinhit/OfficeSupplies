import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

    products = [
        {
            firstname: 'Tinh',
            lastname: 'Duong',
            phoneNumber: '0989828527',
            email: 'duongvantinh07072017@gmail.com',
            address: 'Man thiện - Hiệp phú - Tp.Thủ Đức',
        },
        {
            firstname: 'Tinh',
            lastname: 'Duong',
            phoneNumber: '0989828527',
            email: 'duongvantinh07072017@gmail.com',
            address: 'Man thiện - Hiệp phú - Tp.Thủ Đức',
        },
        {
            firstname: 'Tinh',
            lastname: 'Duong',
            phoneNumber: '0989828527',
            email: 'duongvantinh07072017@gmail.com',
            address: 'Man thiện - Hiệp phú - Tp.Thủ Đức',
        },
    ];
}
