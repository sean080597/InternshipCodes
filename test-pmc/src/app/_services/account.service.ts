import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account, AccountPasswordSetting, ACCOUNT_FE_BE_MAPPING_FIELD } from '@app/_models/account/account.model';
import { API_URL } from '@app/_constants/api-url.enum';
import { HttpClientService } from './http-client.service';
import { OperationService } from './operation.service';
import { CommonService } from './common.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CompanyPermissionsComponent } from '@app/account/company-permissions/company-permissions.component';
import { HISTORY_ACTIONS, ROLES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private API_ENDPOINT = environment.apiUrl;
  private API_ENDPOINT_SERVICES = environment.apiUrl + API_URL.SERVICES;
  LC_COMPANY_ID = 'companyID';
  LC_COMPANY_NAME = 'companyName';

  constructor(
    private router: Router,
    private http: HttpClient,
    private httpService: HttpClientService,
    private operationService: OperationService,
    private modalService: BsModalService,
    private commonService: CommonService,
  ) { }

  public get accountValue(): Account {
    const account = JSON.parse(localStorage.getItem('account'));
    return account;
  }

  getAccountValue(property: string) {
    return this.accountValue ? this.accountValue[property] : null
  }

  isRoleServieAdmin() {
    return this.getAccountValue('role') ? this.getAccountValue('role')[0] === ROLES.ROLE_SERVICE_ADMIN : null
  }

  login(account: Account): Observable<Account> {
    return this.http
      .post<Account>(`${this.API_ENDPOINT}/auth/login`, account)
      .pipe(
        map((res: any) => {
          res = new Account(Object.assign(res, account));
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('account', JSON.stringify(res));
          return res;
        })
      );
  }
  refreshToken(): Observable<Account> {
    const account = JSON.parse(localStorage.getItem('account')) as Account;
    const acountBody = {
      [ACCOUNT_FE_BE_MAPPING_FIELD['refreshToken']]: account.refreshToken,
    };
    return this.http
      .post<Account>(`${this.API_ENDPOINT}/auth/refresh`, acountBody)
      .pipe(
        map((res: any) => {
          res = new Account(Object.assign(res, account));
          localStorage.setItem('account', JSON.stringify(res));
          return res;
        })
      );
  }
  logout() {
    this.modalService.hide()
    this.commonService.setTurnOffModal(true)
    this.operationService.saveOperation('LOGOUT').subscribe()
    const tmpLC = localStorage.getItem('agreedUsers')
    localStorage.clear();
    if (tmpLC) localStorage.setItem('agreedUsers', tmpLC)
    this.router.navigate(['/account/login']);
  }

  saveAgreedUser() {
    const agreedUsers = localStorage.getItem('agreedUsers') ? JSON.parse(localStorage.getItem('agreedUsers')) : []
    if (!agreedUsers.includes(this.accountValue.email)) agreedUsers.push(this.accountValue.email)
    localStorage.setItem('agreedUsers', JSON.stringify(agreedUsers))
  }

  checkExistingAgreedUser() {
    const agreedUsers = localStorage.getItem('agreedUsers') ? JSON.parse(localStorage.getItem('agreedUsers')) : []
    return agreedUsers.includes(this.accountValue.email)
  }

  agreeTermOfUse(user): Observable<any> {
    return this.http
      .post(`${this.API_ENDPOINT_SERVICES}/users/agree-term`, user)
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('account', JSON.stringify(user));
          return user;
        })
      );
  }

  register(acount: Account): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/register`,
      acount
    );
  }
  setPassword(body: AccountPasswordSetting): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/account/setting-password`,
      body
    );
  }
  resetPassword(body: AccountPasswordSetting): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/account/reset-password/finish`,
      body
    );
  }
  forgetPassword(acount: Account): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/account/reset-password/init`,
      acount
    );
  }
  changePassword(account: Account): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/account/change-password`,
      account
    );
  }

  getBellsList(params = { page: 1, pageSize: 5 }): Observable<any> {
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/notification/list-notify`, { params });
  }
  updateBellsList(id: number): Observable<any> {
    return this.httpService.put(`${API_URL.SERVER_SERVICE}/notification/read-notify/${id}`);
  }
  checkHideInfoTemp(curRoute: string) {
    return (
      curRoute.includes('login') ||
      curRoute.includes('admin-authentication') ||
      curRoute.includes('set-password') ||
      curRoute.includes('reset-password') ||
      curRoute.includes('copyright') ||
      curRoute.includes('maintenance')
    );
  }

  openCompanyPermissionsModal(initialState) {
    this.modalService.show(CompanyPermissionsComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState
    })
  }

  handleCompanyPermissionModal() {
    if(this.isRoleServieAdmin()) {
      this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS96001).subscribe()
      this.openCompanyPermissionsModal({})
    }
  }
}
