import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { OfficeSuppliesComponent } from './office-supplies/office-supplies.component';
import { CategoryComponent } from './office-supplies/category/category.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', component: OfficeSuppliesComponent },
            { path: 'category', component: CategoryComponent },
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
