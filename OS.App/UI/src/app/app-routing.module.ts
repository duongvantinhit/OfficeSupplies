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
import { UserInforComponent } from './office-supplies/user-infor/user-infor.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AdminComponent } from './admin/admin.component';
import { CrudProductComponent } from './admin/crud-product/crud-product.component';
import { CrudCategoryComponent } from './admin/crud-category/crud-category.component';
import { CrudPromotionComponent } from './admin/crud-promotion/crud-promotion.component';
import { CategoriesAdminComponent } from './admin/categories-admin/categories-admin.component';
import { ProductsAdminComponent } from './admin/products-admin/products-admin.component';
import { PromotionsAdminComponent } from './admin/promotions-admin/promotions-admin.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthGuard } from './shared/guards/AuthGuard';
import { RoleGuard } from './shared/guards/RoleGuard';
import { AdminGuard } from './shared/guards/AdminGuard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: OfficeSuppliesComponent },
            { path: 'user-infor', component: UserInforComponent },
            { path: 'change-password', component: ChangePasswordComponent },
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
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard, RoleGuard],
        children: [
            { path: '', component: CategoriesAdminComponent },
            { path: 'category', component: CrudCategoryComponent },
            { path: 'categories', component: CategoriesAdminComponent },
            { path: 'products', component: ProductsAdminComponent },
            { path: 'product', component: CrudProductComponent },
            { path: 'promotions', component: PromotionsAdminComponent },
            { path: 'promotion', component: CrudPromotionComponent },
            { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
            { path: 'user-infor', component: UserInforComponent },
            { path: 'change-password', component: ChangePasswordComponent },
        ],
    },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
