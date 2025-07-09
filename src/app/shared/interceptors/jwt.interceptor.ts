import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../../users/services/auth.service';

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();

  const authUrls = [
    'http://localhost:8080/api/v1/authentication/sign-in',
    'http://localhost:8080/api/v1/authentication/sign-up'
  ];

  const isAuthUrl = authUrls.some(url => req.url.startsWith(url));


  if (authToken && !isAuthUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  return next(req);
};
