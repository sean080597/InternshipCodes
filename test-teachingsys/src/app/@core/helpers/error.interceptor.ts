import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: any) => {
      if ([401].indexOf(err.status) !== -1) {
        // auto logout if 401 response returned from api
        this.authService.logout();
        location.reload()
      }

      const error = err.error.error?.message || err.statusText;
      return throwError(() => error);
    }))
    //   return next.handle(request).pipe(
    //     tap(
    //       event => {
    //         if (event instanceof HttpResponse) {
    //           if (event.status == 200) {
    //             console.log(event);
    //           }
    //         }
    //       },
    //       error => {
    //         console.log(error);
    //         if (error.status >= 500) {
    //           // this.router.navigate(['/error'], { state: { httpCode: error.status, errMessage: error.message } });
    //         }
    //       })
    //   );
  }
}
