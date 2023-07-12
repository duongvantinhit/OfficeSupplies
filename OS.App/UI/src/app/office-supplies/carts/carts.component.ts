import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-carts',
    templateUrl: './carts.component.html',
    styleUrls: ['./carts.component.scss'],
})
export class CartsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

    products = [
        {
            name: 'Bàn phím gaming',
            img: '../../../assets/img/introduce/keyboard.jpeg',
            price: 787878,
            quantity: 1,
        },
        {
            name: 'Chuột gaming',
            img: '../../../assets/img/introduce/keyboard.jpeg',
            price: 20000,
            quantity: 1,
        },
        {
            name: 'Màn hình laptop',
            img: '../../../assets/img/introduce/keyboard.jpeg',
            price: 13131,
            quantity: 1,
        },
    ];

    value1: number = 1;
}
