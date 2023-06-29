import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { DemoComponent } from '../office-supplies/demo/demo.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],

  declarations: [
    LayoutComponent,
    DemoComponent
  ],
  
  exports:[LayoutComponent]
})
export class LayoutModule { }
