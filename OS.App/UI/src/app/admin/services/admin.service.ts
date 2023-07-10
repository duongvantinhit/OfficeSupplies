import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseApiService } from 'src/app/shared/services/base-api.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService extends BaseApiService {
    public _behaviorSubject = new BehaviorSubject<any>(null);
    public getMessage = this._behaviorSubject.asObservable();
    public sendMessage(msg: any) {
        this._behaviorSubject.next(msg);
    }

    getDataAll(url: any): Observable<any> {
        return this.get(url);
    }

    getData(url: any, param: any): Observable<any> {
        return this.get(url + param);
    }

    postData(url: any, requestBody: any): Observable<any> {
        return this.post(url, requestBody);
    }

    putData(url: any, requestBody: any, id: any): Observable<any> {
        return this.put(url + id, requestBody);
    }

    loadPages(page: any, url: any): Observable<any> {
        let queryParams = new URLSearchParams(page).toString();
        return this.get(`${url}?${queryParams}`);
    }
}
