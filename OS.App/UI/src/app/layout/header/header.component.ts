import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { OfficeSuppliesService } from 'src/app/office-supplies/services/office-supplies.service';
import { AppMessages } from 'src/app/shared/const/messages.const';
import { Notice } from 'src/app/shared/const/notice.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/auth/services/auth.service';
import { ParentCategoryEnum } from 'src/app/shared/const/parentCategory.const';

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
    searchProduct: any;
    searchVisible: boolean = false;
    carts: any;
    totalProducts: any;
    searchText = '';
    selectedCategory: any;
    categoriesHeader: any[] = [];
    selectedCity: any;
    isListboxVisible: boolean = false;
    isSearchResultVisible: boolean = false;
    parentCategories: string[] = Object.values(ParentCategoryEnum);
    accountMenu = [
        {
            label: 'Đăng xuất',
            icon: 'pi pi-sign-in',
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
        {
            label: 'Thông tin tài khoản',
            icon: 'pi pi-user-plus',
            routerLink: 'user-infor',
            command: () => {},
        },
    ];
    navItems: MenuItem[] = [
        {
            label: 'Trang chủ',
            items: [],
        },
    ];

    ngOnInit() {
        this._apiServices.getUpdateCart.subscribe((res) => {
            if (res) {
                this._apiServices.getDataAll('/carts').subscribe((res) => {
                    this.carts = res.data.cartDetails;
                    this.totalProducts = res.data.cartDetails.length;
                });
            }
        });

        this._apiServices.getDataAll('/categories/name').subscribe((res) => {
            const _navItems: MenuItem[] = [
                {
                    label: 'Trang chủ',
                    routerLink: '/',
                },
            ];
            for (const parent of this.parentCategories) {
                _navItems.push({
                    label: parent,
                    items: res.data
                        .filter((category: any) => category.parent === parent)
                        .map((category: any) => {
                            return {
                                label: category.categoryName,
                                routerLink: `/category`,
                                queryParams: { id: category.id },
                            };
                        }),
                });
            }
            this.navItems = _navItems;
            this.cdr.detectChanges();
        });
    }

    toggleListbox() {
        this.isListboxVisible = !this.isListboxVisible;
    }

    toggleListProductbox() {
        this.isSearchResultVisible = !this.isListboxVisible;
    }

    onCategoryChange(event: any) {
        this.product(event.value);
    }

    onProductChange(event: any) {
        this.productDetail(event.value.id);
    }

    onMouseEnter(type: any): void {
        switch (type) {
            case 'category':
                this.categoryVisible = true;
                this.cdr.detectChanges();
                break;
            case 'cart':
                this._apiServices.getDataAll('/carts').subscribe((res) => {
                    this.carts = res.data.cartDetails;
                    this.totalProducts = res.data.cartDetails.length;
                });
                this.cartVisible = true;
                this.cdr.detectChanges();
                break;
            case 'search':
                this.searchVisible = true;
                this.isSearchResultVisible = false;
                this.cdr.detectChanges();
                break;
        }
    }
    onMouseLeave(type: any): void {
        switch (type) {
            case 'category':
                this.categoryVisible = false;
                this.cdr.detectChanges();
                break;
            case 'cart':
                this.cartVisible = false;
                this.cdr.detectChanges();
                break;
            case 'search':
                this.searchVisible = false;
                this.isSearchResultVisible = false;
                this.cdr.detectChanges();
                break;
        }
    }

    productDetail(productId: any): void {
        this._router.navigate(['/product/detail'], {
            queryParams: { id: productId },
        });
    }

    goToCarts(): void {
        this._router.navigate(['/cart']);
    }

    product(item: any): void {
        this._router.navigate(['/category'], {
            queryParams: { id: item.id, name: item.categoryName },
        });
    }

    search(): void {
        this.searchProduct = true;
        this._router.navigate(['/products/search'], {
            queryParams: { search: this.searchText },
        });
    }

    deleteSearch(): void {
        this.searchProduct = null;
        this.searchText = '';
        this._router.navigate(['/products'], {
            queryParams: {},
        });
    }
}
