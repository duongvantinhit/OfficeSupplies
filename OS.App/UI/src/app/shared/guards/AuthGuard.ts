import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private _authService: AuthService, private _router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (this._authService.isLoggedIn()) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}
