import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { OfficeSuppliesComponent } from './office-supplies/office-supplies.component';
import { CategoryComponent } from './office-supplies/category/category.component';
import { ProductsComponent } from './office-supplies/products/products.component';
import { CartsComponent } from './office-supplies/carts/carts.component';
import { ProductDetailComponent } from './office-supplies/product-details/product-detail.component';
import { IntroduceComponent } from './office-supplies/introduce/introduce.component';
import { ContactComponent } from './office-supplies/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { PromotionsComponent } from './office-supplies/promotions/promotions.component';
import { OrderStatusComponent } from './office-supplies/order-status/order-status.component';
import { OrderDetailsComponent } from './office-supplies/order-details/order-details.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: OfficeSuppliesComponent },
            { path: 'login', component: LoginComponent },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'order-status', component: OrderStatusComponent },
            { path: 'order-detail', component: OrderDetailsComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'cart', component: CartsComponent },
            { path: 'product/detail', component: ProductDetailComponent },
            { path: 'introduce', component: IntroduceComponent },
            { path: 'promotions', component: PromotionsComponent },
            { path: 'contact', component: ContactComponent },
        ],
    },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
