import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { decodeToken } from 'src/app/shared/helpers/jwt.helper';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private _router: Router) {}
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            const decodedToken = decodeToken(access_token);
            if (decodedToken && decodedToken.exp < Date.now() / 1000) {
                // Token hết hạn, đăng xuất người dùng
                this.authService.logout();
                this._router.navigate(['/login']);
            } else {
                // Token hợp lệ, thêm vào Authorization header
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
            }
        }
        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    // Token không hợp lệ hoặc hết hạn, đăng xuất người dùng
                    this.authService.logout();
                    this._router.navigate(['/login']);
                }
                return throwError(() => new Error(error.message || 'Unexpected error'));
            }),
        );
    }
}
