import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { PaginatorModule } from 'primeng/paginator';
import { MenuModule } from 'primeng/menu';
import { OverlayModule } from 'primeng/overlay';
import { DropdownModule } from 'primeng/dropdown';

const modules = [
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule,
    GalleriaModule,
    DividerModule,
    FieldsetModule,
    PaginatorModule,
    MenuModule,
    OverlayModule,
    DropdownModule,
];

@NgModule({
    imports: modules,
    exports: modules,
})
export class PrimeNGModule {}
