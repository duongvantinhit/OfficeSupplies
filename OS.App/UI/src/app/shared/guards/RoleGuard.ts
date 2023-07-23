import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { decodeToken } from '../helpers/jwt.helper';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard {
    constructor(private _authServices: AuthService, private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let roles = this._authServices.currentUser().roles;
        if (!roles) {
            this._router.navigate(['']);
            return false;
        }
        if (roles.indexOf('admin') !== -1 || roles.indexOf('employee') !== -1) {
            return true;
        } else {
            this._router.navigate(['']);
            return false;
        }
    }
}
