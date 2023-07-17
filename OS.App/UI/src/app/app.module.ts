import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from './shared/services/notification.service';
import { AuthGuard } from './shared/guards/AuthGuard';
import { AuthService } from 'src/auth/services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/auth/auth.interceptor';
import { TokenInterceptor } from 'src/auth/token.interceptor';

@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
    imports: [BrowserModule, AppRoutingModule, LayoutModule, BrowserAnimationsModule],
    providers: [
        //{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        MessageService,
        NotificationService,
        ConfirmationService,
        AuthGuard,
        AuthService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
