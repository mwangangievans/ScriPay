import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor triggered for:', request.url);

    if (request.headers.has('skip-auth')) {
      console.log('Skipping auth for:', request.url);
      const newHeaders = request.headers.delete('skip-auth');
      return next.handle(request.clone({ headers: newHeaders }));
    }

    const authToken = this._AuthService.getAccessToken();
    console.log('Auth token:', authToken);

    if (!authToken) {
      console.log('No auth token found, logging out and redirecting to login');
      this._AuthService.logout();
      this._Router.navigate(['/login']);
      return next.handle(request); // continue without modifying
    }

    // Create headers
    let headers = request.headers.set('Authorization', `Bearer ${authToken}`);
    headers = headers.set('Accept', 'application/json');

    // Only set Content-Type if not FormData
    if (!(request.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

    const authReq = request.clone({ headers });

    return next.handle(authReq);
  }
}
