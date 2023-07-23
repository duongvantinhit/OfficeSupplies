import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard {
    constructor(private _authServices: AuthService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let roles = this._authServices.currentUser().roles;
        if (roles.indexOf('admin') !== -1) {
            return true;
        } else {
            return false;
        }
    }
}
