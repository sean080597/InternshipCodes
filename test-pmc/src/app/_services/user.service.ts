import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { UserResponse, CompanyResponse, Users } from "@models/users";
import { HttpClientService } from "./http-client.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { API_URL } from "@app/_constants/api-url.enum";
import { FilterSource } from "@app/_models/common";
import { FLOWS, ROLES } from "@app/_constants";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_ENDPOINT_SERVICES = environment.apiUrl + API_URL.SERVICES;

  defaultFilterSource: FilterSource = {
    authorities: '',
    emailAddress: '',
    companyId: '',
    sortBy: 'EMAIL_ASC',
  };
  filterSource: FilterSource

  AUTHORITY_LIST: Array<any> = [
    { key: "LB_AUTHORITY_CLASSIFICATION_1", value: ROLES.ROLE_SERVICE_ADMIN },
    { key: 'LB_AUTHORITY_CLASSIFICATION_2', value: ROLES.ROLE_MERCHANT_MANAGER },
  ];
  // {key: "LB_AUTHORITY_CLASSIFICATION_1", value: 'ROLE_ADMIN'},
  constructor(
    private httpService: HttpClientService,
    private http: HttpClient,
    private commonService: CommonService
  ) {
    this.resetSearchFilter()
    this.commonService.currentFlow$.subscribe((curFlow: string) => {
      if (curFlow !== FLOWS.USER) {
        this.resetSearchFilter()
      }
    })
  }

  public resetSearchFilter() {
    this.filterSource = { ...this.defaultFilterSource }
  }

  public getCompanyList(options = null): Observable<any> {
    const optionsData = options ?? { page: 1, pageSize: 120, companyName: '' }
    return this.http
      .get(`${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/company?`, { params: optionsData })
      .pipe(
        map((res: CompanyResponse) => {
          return res;
        })
      );
  }

  public getAllUser(options = null): Observable<any> {
    const optionsData = options ?? { page: 1, pageSize: 23, emailAddress: '', companyId: 1, authorities: '', }
    return this.http
      .get(`${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/users?`, { params: optionsData })
      .pipe(
        map((res: UserResponse) => {
          return res;
        })
      );
  }

  public deleteMultiUsers(idList: string[]): Observable<any> {
    return this.http.post(`${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/users/multi-delete`, idList);
  }

  public deleteAllUsers(options): Observable<any> {
    const optionsData = options
    return this.http.delete(`${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/users/all-delete`, { params: optionsData }).pipe(
      (res) => {
        return res;
      })
    }

  public submitUserCreation(userData): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/users/?`,
      userData
    );
  }

  public unlockUser(userId): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/account/unlock/${userId}?`,
      userId
    );
  }

  public submitUserEditing(userId, userData): Observable<any> {
    return this.http.put(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/users/${userId}?`,
      userData
    );
    // return of(USER[0]).pipe(delay(500));
  }

  public submitUserDeleting(userId): Observable<any> {
    return this.http.delete(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/users/${userId}?`
    );
    // return of(USER[0]).pipe(delay(500));
  }

  public resendEmail(userData): Observable<any> {
    return this.http.post(
      `${this.API_ENDPOINT_SERVICES}${API_URL.UAA}/account/resend-email`,
      userData
    );
  }
}
