import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, mergeMap, of } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard {
    constructor(private _authServices: AuthService, private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this._authServices.getUserInfor().pipe(
            mergeMap((res) => {
                if (!res.data.roles) {
                    this._router.navigate(['']);
                    return of(false);
                }

                if (res.data.roles.indexOf('admin') !== -1 || res.data.indexOf('employee') !== -1) {
                    return of(true);
                } else {
                    this._router.navigate(['']);
                    return of(false);
                }
            }),
        );
    }
}
