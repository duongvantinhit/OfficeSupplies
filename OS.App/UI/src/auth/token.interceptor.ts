import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService, private _router: Router) {}

    private isRefreshing = false;
    private refreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            withCredentials: true,
        });

        return next.handle(request).pipe(
            catchError((error) => {
                if (error.status === 401 && !request.url.includes('/refresh-token')) {
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        this.refreshSubject.next(null);

                        return this._authService.refreshToken().pipe(
                            switchMap((tokenResponse) => {
                                this.isRefreshing = false;
                                this.refreshSubject.next(tokenResponse);
                                return next.handle(request);
                            }),
                            catchError((error) => {
                                this.isRefreshing = false;
                                this._authService.logout();
                                this._router.navigate(['/login']);
                                return of(null).pipe(
                                    map(() => {
                                        throw new Error('Something went wrong');
                                    }),
                                );
                            }),
                        );
                    } else {
                        return this.refreshSubject.pipe(
                            filter((tokenResponse) => tokenResponse != null),
                            take(1),
                            switchMap((tokenResponse) => {
                                return next.handle(request);
                            }),
                        );
                    }
                } else {
                    return of(error);
                }
            }),
        );
    }
}
