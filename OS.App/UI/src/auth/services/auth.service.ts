import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EndpointUri } from 'src/app/shared/const/endpoint.const';
import { BaseApiService } from 'src/app/shared/services/base-api.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable()
export class AuthService extends BaseApiService {
    constructor(http: HttpClient, notiService: NotificationService, private _router: Router) {
        super(http, notiService);
        this.baseUrl = EndpointUri.Auth;
    }

    private refreshTokenTimeout: any;
    userStored = localStorage.getItem('OS_CURRENT_USER');

    postData(url: any, requestBody: any): Observable<any> {
        return this.post(url, requestBody);
    }

    getData(url: any, param: any): Observable<any> {
        return this.get(`${url}/` + param);
    }

    getDataAll(url: any): Observable<any> {
        return this.get(url);
    }

    deleteData(url: any, id: any): Observable<any> {
        return this.delete(`${url}/` + id);
    }

    getUserInfor(): Observable<any> {
        return this.get('/user/infor');
    }

    currentUser() {
        return JSON.parse(localStorage.getItem('OS_CURRENT_USER')!);
    }

    putData(url: any, requestBody: any, id: any): Observable<any> {
        return this.put(`${url}/` + id, requestBody);
    }

    logout(): void {
        localStorage.removeItem('OS_CURRENT_USER');
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('OS_CURRENT_USER');
        return !!token;
    }

    refreshToken() {
        let email = this.currentUser().email;
        const refreshTokenForm = {
            email: email,
        };

        const headers = { 'Content-Type': 'application/json' };
        return this.http
            .post<any>('https://localhost:7072/api/Auth/refreshtoken', refreshTokenForm, {
                withCredentials: true,
            })
            .pipe(
                tap((response) => {
                    if (!response.successed) {
                        this.logout();
                        this._router.navigate(['/login']);
                        return;
                    }

                    const expiresIn = this.getTokenExpirationDate(response.data).valueOf() - new Date().valueOf();
                    this.refreshTokenTimeout = setTimeout(() => {
                        this.refreshToken().subscribe();
                    }, expiresIn - 40000);
                }),
            );
    }

    getTokenExpirationDate(exp: any): Date {
        const date = new Date(0);
        date.setUTCSeconds(exp);
        return date;
    }
}
