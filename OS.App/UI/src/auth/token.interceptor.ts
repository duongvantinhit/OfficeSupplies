import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService, private _router: Router) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            withCredentials: true,
        });

        return next.handle(request).pipe(
            catchError((error) => {
                if (error.status === 401 && !request.url.includes('/refresh-token')) {
                    return this._authService.refreshToken().pipe(
                        catchError((error) => {
                            this._authService.logout();
                            this._router.navigate(['/login']);
                            return of(null).pipe(
                                map(() => {
                                    throw new Error('Something went wrong');
                                }),
                            );
                        }),

                        switchMap(() => {
                            return next.handle(request);
                        }),
                    );
                } else {
                    return of(null).pipe(
                        map(() => {
                            this._authService.logout();
                            this._router.navigate(['/login']);
                            throw new Error('Something went wrong');
                        }),
                    );
                }
            }),
        );
    }
}
