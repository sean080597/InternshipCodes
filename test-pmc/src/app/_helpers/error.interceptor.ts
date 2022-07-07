import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';
import { Account } from '@app/_models/account/account.model';
import { Router } from '@angular/router';
import { CommonService } from '@app/_services/common.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private accountService: AccountService,
    private commonService: CommonService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401].includes(err.status)) {
        return this.handle401Error(request, next);
      }
      if ([403].includes(err.status) && this.accountService.accountValue) {
        // auto logout if 403 response returned from api
        this.accountService.logout();
      }
      // if ([500].includes(err.status) && this.accountService.accountValue) {
      //   this.router.navigate(['/maintenance']);
      // }
      if (![404, 400].includes(err.status) && this.accountService.accountValue) {
        this.router.navigate(['/managements/error-page'], { state: { error: err.error, statusCode: err.status} });
      }

      return throwError(err.error);
    }))
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.accountService.refreshToken().pipe(
        switchMap((account: Account) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(`${account.tokenType} ${account.token}`);

          return next.handle(this.addTokenHeader(request, `${account.tokenType} ${account.token}`));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.commonService.hideLoading();
          this.accountService.logout();
          return throwError(err);
        })
      );
    } else {
      this.isRefreshing = false;
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set('Authorization', token) });
  }
}