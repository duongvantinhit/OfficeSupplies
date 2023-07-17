import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { decodeToken } from '../helpers/jwt.helper';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard {
    constructor(private _authService: AuthService, private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let token = this._authService.getAccessToken();
        let decode = decodeToken(token!);
        if (decode.role === 'admin') {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}
