import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

import { AccountService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { Account } from '@app/_models/account/account.model';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  callStack = 0;

  constructor(
    private accountService: AccountService,
    private commonService: CommonService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(['/term_of_use', '/license', '/steraVideoUrl'].some(t => request.url.indexOf(t) > -1)){
      return next.handle(request)
    }

    // add auth header with jwt if user is logged in and request is to the api url
    const account = JSON.parse(localStorage.getItem('account')) as Account;
    const isLoggedIn = account && account.token;
    if (
      this.ignoreSpinner(request)
    ) {
      this.callStack++;
    }
    if (this.callStack === 1) {
      this.commonService.showLoading();
    }
    request = request.clone({
      setHeaders: {
        'X-Screen-ID': `${this.commonService.getScreenId()}`,
        'X-Timezone': `${this.commonService.timeZone}`,
        'Accept-Language': 'ja'
      },
    });
    if (isLoggedIn) {
      const params = new HttpParams({fromString: request.params.toString(), encoder: new CustomEncoder()})
      request = request.clone({
        setHeaders: {
          Authorization: `${account.tokenType} ${account.token}`,
          'X-CID': `${localStorage.getItem(this.accountService.LC_COMPANY_ID) || ''}`
        },
        params
      });
    }
    //
    return next.handle(request).pipe(
      finalize(() => {
        if (
          this.ignoreSpinner(request)
        ) {
          this.callStack--;
        }
        if (this.callStack === 0) {
          this.callStack = 0;
          this.commonService.hideLoading();
        }
      })
    );
  }
  ignoreSpinner(request: HttpRequest<any>): boolean {
    if (request.url.indexOf('/i18n') > -1) { // no loading spinner get api translate i18n
      return false;
    }
    if (request.url.indexOf('-notify') > -1) { // no loading spinner when the api is notify bell
      return false;
    }
    return true;
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
      return encodeURIComponent(key);
  }
  encodeValue(key: string): string {
      return encodeURIComponent(key);
  }
  decodeKey(key: string): string {
      return decodeURIComponent(key);
  }
  decodeValue(key: string): string {
      return decodeURIComponent(key);
  }
}
