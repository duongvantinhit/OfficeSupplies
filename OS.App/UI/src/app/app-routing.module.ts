import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DemoComponent } from './office-supplies/demo/demo.component';

const routes: Routes = [
  {
    path : '',
    component: LayoutComponent, children:[
      { path: 'demo', component: DemoComponent },
    ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
