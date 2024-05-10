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
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ListboxModule } from 'primeng/listbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SliderModule } from 'primeng/slider';
import { NgxEditorModule } from 'ngx-editor';
import { MenubarModule } from 'primeng/menubar';


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
    TableModule,
    InputNumberModule,
    TabViewModule,
    InputTextareaModule,
    PasswordModule,
    InputMaskModule,
    PanelMenuModule,
    AvatarModule,
    FileUploadModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    DialogModule,
    ChartModule,
    EditorModule,
    SplitButtonModule,
    ListboxModule,
    OverlayPanelModule,
    SliderModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class PrimeNGModule { }
