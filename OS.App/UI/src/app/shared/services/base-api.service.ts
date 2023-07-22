import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, retry } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { NotificationService } from './notification.service';

@Injectable()
export class BaseApiService {
    protected baseUrl = environment.apiBaseURI;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };

    constructor(public http: HttpClient, private notiService: NotificationService) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }),
        };
    }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(this.baseUrl + url).pipe(
            retry(environment.requestRetry), // retry a failed request up to 3 times
            catchError(this.handleError), // then handle the error
        );
    }

    post(url: string, data?: any, options?: any): Observable<any> {
        return this.http
            .post(this.baseUrl + url, data, options)
            .pipe(retry(environment.requestRetry), catchError(this.handleError));
    }

    put(url: string, data?: any, options?: any): Observable<any> {
        return this.http
            .put(this.baseUrl + url, data, options)
            .pipe(retry(environment.requestRetry), catchError(this.handleError));
    }

    delete(url: string, options?: any): Observable<any> {
        return this.http
            .delete(this.baseUrl + url, options)
            .pipe(retry(environment.requestRetry), catchError(this.handleError));
    }

    download(url: string): Observable<any> {
        return this.http
            .get(this.baseUrl + url, {
                observe: 'response',
                responseType: 'blob',
            })
            .pipe(retry(environment.requestRetry), catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
            this.notiService.error(error.message);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
