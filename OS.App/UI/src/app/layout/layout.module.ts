import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { PrimeNGModule } from '../shared/modules/primeng.module';
import { OfficeSuppliesComponent } from '../office-supplies/office-supplies.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CategoryComponent } from '../office-supplies/category/category.component';
import { ProductsComponent } from '../office-supplies/products/products.component';
import { CartsComponent } from '../office-supplies/carts/carts.component';
import { ProductDetailComponent } from '../office-supplies/product-details/product-detail.component';
import { IntroduceComponent } from '../office-supplies/introduce/introduce.component';
import { ContactComponent } from '../office-supplies/contact/contact.component';
import { LoginComponent } from '../pages/login/login.component';
import { ForgotPasswordComponent } from '../pages/forgot-password/forgot-password.component';
import { SignUpComponent } from '../pages/sign-up/sign-up.component';
import { PromotionsComponent } from '../office-supplies/promotions/promotions.component';
import { PurchaseComponent } from '../office-supplies/purchase/purchase.component';
import { NoOrdersComponent } from '../pages/no-orders/no-orders.component';
import { UserInforComponent } from '../office-supplies/user-infor/user-infor.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';
import { AdminComponent } from '../admin/admin.component';
import { CrudProductComponent } from '../admin/crud-product/crud-product.component';
import { CrudCategoryComponent } from '../admin/crud-category/crud-category.component';
import { CrudPromotionComponent } from '../admin/crud-promotion/crud-promotion.component';
import { CategoriesAdminComponent } from '../admin/categories-admin/categories-admin.component';
import { ProductsAdminComponent } from '../admin/products-admin/products-admin.component';
import { PromotionsAdminComponent } from '../admin/promotions-admin/promotions-admin.component';
import { UsersComponent } from '../admin/users/users.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from '../office-supplies/checkout/checkout.component';
import { OrdersAdminComponent } from '../admin/orders-admin/orders-admin.component';
import { StatisticsComponent } from '../admin/statistics/statistics.component';

@NgModule({
    declarations: [
        LayoutComponent,
        OfficeSuppliesComponent,
        HeaderComponent,
        FooterComponent,
        CategoryComponent,
        ProductsComponent,
        CartsComponent,
        ProductDetailComponent,
        IntroduceComponent,
        ContactComponent,
        LoginComponent,
        ForgotPasswordComponent,
        SignUpComponent,
        PromotionsComponent,
        PurchaseComponent,
        NoOrdersComponent,
        UserInforComponent,
        ChangePasswordComponent,
        AdminComponent,
        CrudProductComponent,
        CrudCategoryComponent,
        CrudPromotionComponent,
        CategoriesAdminComponent,
        ProductsAdminComponent,
        PromotionsAdminComponent,
        UsersComponent,
        CheckoutComponent,
        OrdersAdminComponent,
        StatisticsComponent,
    ],

    imports: [CommonModule, RouterModule, PrimeNGModule, FormsModule, ReactiveFormsModule],

    providers: [DialogService],

    exports: [LayoutComponent],
})
export class LayoutModule {}
