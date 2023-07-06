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
    ],

    imports: [CommonModule, RouterModule, PrimeNGModule],

    exports: [LayoutComponent],
})
export class LayoutModule {}
