import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { DemoComponent } from '../office-supplies/demo/demo.component';
import { PrimeNGModule } from '../shared/modules/primeng.module';
import { OfficeSuppliesComponent } from '../office-supplies/office-supplies.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [LayoutComponent, DemoComponent, OfficeSuppliesComponent, HeaderComponent, FooterComponent],

    imports: [CommonModule, RouterModule, PrimeNGModule],

    exports: [LayoutComponent],
})
export class LayoutModule {}
