import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private auth: AuthenticationService,
        public http: HttpClient
    ) { }

    canActivate(
    ): boolean {

        if (this.auth.isAuthenticated()) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
