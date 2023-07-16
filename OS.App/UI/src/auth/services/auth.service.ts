import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointUri } from 'src/app/shared/const/endpoint.const';
import { BaseApiService } from 'src/app/shared/services/base-api.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable()
export class AuthService extends BaseApiService {
    constructor(http: HttpClient, notiService: NotificationService) {
        super(http, notiService);
        this.baseUrl = EndpointUri.Auth;
    }

    login(url: any, requestBody: any): Observable<any> {
        return this.post(url, requestBody);
    }

    logout() {
        localStorage.removeItem('token');
        // localStorage.removeItem('refresh_token');
    }

    isLoggedIn() {
        const accessToken = localStorage.getItem('token');
        return !!accessToken;
    }

    getAccessToken() {
        return localStorage.getItem('token');
    }
}
