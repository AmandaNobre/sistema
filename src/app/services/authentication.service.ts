import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment.ts/environments';
// import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable()
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;

    constructor(
        public http: HttpClient,
        // private jwtHelper: JwtHelperService
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem(environment.user));
    }

    getToken(): string {
        let itemLocal = (localStorage.getItem(environment.user)) || null;

        if (itemLocal) {
            return JSON.parse(itemLocal)?.token;
        } else {
            return '';
        }
    }
    tokenHasExpired(): boolean {
        // if (this.jwtHelper.isTokenExpired(this.getToken())) {
        //     return true
        // } else {
        return true
        // }
    }

    setAuth(identity: any) {
        this.currentUserSubject.next(identity);
        localStorage.removeItem(environment.user)
        localStorage.setItem(environment.user, JSON.stringify(identity))
    }

    getLoggedUser(): any {
        return JSON.parse(this.currentUserSubject.value);
    }

    loggout() {
        localStorage.removeItem(environment.user)
    }

    isAuthenticated(): boolean {
        return !this.getLoggedUser() && this.tokenHasExpired() ? false : true;
    }

}
