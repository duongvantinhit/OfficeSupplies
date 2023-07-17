import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap, throwError } from 'rxjs';
import { EndpointUri } from 'src/app/shared/const/endpoint.const';
import { decodeToken } from 'src/app/shared/helpers/jwt.helper';
import { BaseApiService } from 'src/app/shared/services/base-api.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable()
export class AuthService extends BaseApiService {
    constructor(http: HttpClient, notiService: NotificationService) {
        super(http, notiService);
        this.baseUrl = EndpointUri.Auth;
    }

    private refreshTokenTimeout: any;

    login(url: any, requestBody: any): Observable<any> {
        return this.post(url, requestBody);
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return !!token;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    setAccessToken(token: any) {
        localStorage.setItem('access_token', token);
    }

    setRefreshToken(token: any) {
        localStorage.setItem('refresh_token', token);
    }

    isTokenExpired(): boolean {
        const token = this.getAccessToken();
        if (!token) {
            return true;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        const now = Date.now();

        return expirationTime < now;
    }

    refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken || refreshToken.trim() === '') {
            return of(null).pipe(
                map(() => {
                    throw new Error('Something went wrong');
                }),
            );
        }
        const refreshTokenForm = {
            email: 'duongvantinh07072015@gmail.com',
            refreshToken: localStorage.getItem('refresh_token'),
        };
        return this.http.post<any>('https://localhost:7072/api/Auth/refreshtoken', refreshTokenForm).pipe(
            tap((response) => {
                const newAccessToken = response.data.accessToken;

                this.setAccessToken(response.data.accessToken);
                this.setRefreshToken(response.data.refreshToken);

                clearTimeout(this.refreshTokenTimeout);
                const expiresIn = this.getTokenExpirationDate(newAccessToken).valueOf() - new Date().valueOf();

                this.refreshTokenTimeout = setTimeout(() => {
                    this.refreshToken().subscribe();
                }, expiresIn - 40000); // refresh token trước 1 phút khi access token hết hạn
            }),
        );
    }

    getTokenExpirationDate(token: string): Date {
        const decodedToken = decodeToken(token);
        if (decodedToken.exp === undefined) {
            return null!;
        }
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);
        return date;
    }
}
