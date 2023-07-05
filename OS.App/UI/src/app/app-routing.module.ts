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

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: OfficeSuppliesComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'cart', component: CartsComponent },
            { path: 'product/detail', component: ProductDetailComponent },
            { path: 'introduce', component: IntroduceComponent },
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
