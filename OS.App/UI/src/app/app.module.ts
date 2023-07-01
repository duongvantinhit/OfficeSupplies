import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
    imports: [BrowserModule, AppRoutingModule, LayoutModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
