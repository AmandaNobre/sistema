import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injector } from '@angular/core'
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, finalize, Observable, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    private activeRequests = 0;
    app: any

    constructor(
        private authenticationService: AuthenticationService,
        private messageService: MessageService
    ) {
    }

    async getRefreshToken() {
        const tokenResponse = await this.app.acquireTokenSilent({
            account: this.app.getAllAccounts()[0],
            scopes: ["user.read"]
        })
        if (tokenResponse) {
            this.authenticationService.setAuth(tokenResponse)
            // window.location.reload()
        }
    }
    
    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {

        //   if (this.authenticationService.tokenHasExpired()) {
        //     // this.getRefreshToken()
        //     this.authenticationService.loggout()
        //   }

        if (this.activeRequests === 0) {
            // this.loadingService.show();
        }

        this.activeRequests++;



        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'bearer ' + this.authenticationService.getToken(),
            }
        })

        return next.handle(request).pipe(
            // catchError((error) => {
            //     if (error instanceof HttpErrorResponse) {
            //         switch ((<HttpErrorResponse>error).status) {
            //             case 400: {


            //                 return EMPTY;
            //             }
            //             default: return throwError(error);
            //         }
            //     } else {
            //         return EMPTY
            //     }
            // }),
            finalize(() => { })
        );
    }
}
