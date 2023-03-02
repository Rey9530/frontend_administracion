import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { AuthfakeauthenticationService } from '../services/authfake.service'; 

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor( 
        private authfackservice: AuthfakeauthenticationService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const currentUser = this.authfackservice.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    accessToken: `${currentUser.token}`,
                },
            });
        }
        return next.handle(request);
    }
}
