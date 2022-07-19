import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClientService } from '@app/@core/services/http-client.service';
import { APIs } from '@app/@core/apis';
import { Account } from '@app/@core/models/account';
import { Role } from '@app/@core/models/role';
import { Router } from '@angular/router';

const USER_LCNAME = 'currentUser'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser: BehaviorSubject<Account>;
  readonly currentUser$: Observable<Account>

  constructor(
    private router: Router,
    private httpService: HttpClientService
  ) {
    this._currentUser = new BehaviorSubject<Account>(this.initialUser());
    this.currentUser$ = this._currentUser.asObservable();
  }

  public get currentUserValue(): Account {
    return this._currentUser.value
  }

  initialUser() {
    let account: any = localStorage.getItem(USER_LCNAME);
    account = account ? JSON.parse(account) : null;
    return account && account?.accessToken ? account : null
  }

  login(data) {
    return this.httpService.post(`${APIs.auth.login}`, { ...data })
      .pipe(map(res => {
        if (res && res.data) {
          const userData = res.data
          userData.roles = userData.roles.map(t => t.toLowerCase())
          localStorage.setItem(USER_LCNAME, JSON.stringify(userData));
          this._currentUser.next(userData);
        }
        return res
      }));
  }

  logout() {
    this.httpService.post(`${APIs.auth.logout}`).subscribe()
    localStorage.removeItem(USER_LCNAME);
    this._currentUser.next(null);
    this.router.navigate(['/login']);
  }

  isAdmin() {
    return this._currentUser.value?.roles.includes(Role.Admin)
  }

  isTeacher() {
    return this._currentUser.value?.roles.includes(Role.Teacher)
  }

  isStudent() {
    return this._currentUser.value?.roles.includes(Role.Student)
  }
}
