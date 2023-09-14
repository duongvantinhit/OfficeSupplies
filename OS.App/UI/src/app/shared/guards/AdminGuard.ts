import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, mergeMap, of } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Notice } from '../const/notice.const';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard {
    constructor(private _authServices: AuthService, private _notiService: NotificationService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this._authServices.getUserInfor().pipe(
            mergeMap((res) => {
                if (res.data.roles.indexOf('admin') !== -1) {
                    return of(true);
                } else {
                    this._notiService.error(Notice.notAllow);
                    return of(false);
                }
            }),
        );
    }
}
