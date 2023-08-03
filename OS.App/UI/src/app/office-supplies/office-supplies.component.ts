import { Component, OnInit } from '@angular/core';
import { OfficeSuppliesService } from './services/office-supplies.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-office-supplies',
    templateUrl: './office-supplies.component.html',
    styleUrls: ['./office-supplies.component.scss'],
})
export class OfficeSuppliesComponent implements OnInit {
    constructor(private _apiServices: OfficeSuppliesService, private _router: Router) {}

    topCategories: any;
    topNewProducts: any;
    topProducts: any;

    images = [
        {
            itemImageSrc: '../../assets/img//introduce/keyboard.jpeg',
            thumbnailImageSrc: '../../assets/img//introduce/keyboard.jpeg',
            alt: 'Bàn phím',
            title: 'Title 1',
        },
        {
            itemImageSrc: '../../assets/img/introduce/pc.jpg',
            thumbnailImageSrc: '../../assets/img/introduce/pc.jpg',
            alt: 'Máy tính',
            title: 'Title 2',
        },
        {
            itemImageSrc: '../../assets/img/introduce/mouse.jpg',
            thumbnailImageSrc: '../../assets/img/introduce/mouse.jpg',
            alt: 'Chuột máy tính',
            title: 'Title 3',
        },
        {
            itemImageSrc: '../../assets/img/introduce/room.jpg',
            thumbnailImageSrc: '../../assets/img/introduce/room.jpg',
            alt: 'Phòng',
            title: 'Title 4',
        },
        {
            itemImageSrc: '../../assets/img/introduce/room2.jpg',
            thumbnailImageSrc: '../../assets/img/introduce/room2.jpg',
            alt: 'Phòng',
            title: 'Title 5',
        },
        {
            itemImageSrc: '../../assets/img/introduce/setup.jpg',
            thumbnailImageSrc: '../../assets/img/introduce/setup.jpg',
            alt: 'Set up',
            title: 'Title 5',
        },
    ];

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    first: number = 0;
    rows: number = 10;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    product(item: any) {
        this._router.navigate(['/category'], {
            queryParams: { id: item.id, name: item.categoryName },
        });
    }

    productDetail(productId: any) {
        this._router.navigate(['/product/detail'], {
            queryParams: { id: productId },
        });
    }

    viewProducts() {
        this._router.navigate(['/products']);
    }

    ngOnInit() {
        this._apiServices.getDataAll('/top/categories').subscribe((res) => {
            this.topCategories = res.data;
        });

        this._apiServices.getDataAll('/top/new/products').subscribe((res) => {
            this.topNewProducts = res.data;
        });

        this._apiServices.getDataAll('/top/products').subscribe((res) => {
            this.topProducts = res.data;
        });
    }
}
