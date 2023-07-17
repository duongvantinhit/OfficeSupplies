import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { decodeToken } from 'src/app/shared/helpers/jwt.helper';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService, private _router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this._authService.getAccessToken();
        if (accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

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
                            const newAccessToken = this._authService.getAccessToken();
                            request = request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newAccessToken}`,
                                },
                            });
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
