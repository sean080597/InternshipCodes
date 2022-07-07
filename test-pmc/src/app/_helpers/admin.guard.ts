import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ROLES } from '@app/_constants';
import { Account } from '@app/_models/account/account.model';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
  ) { }

  canActivate() {
    const account: Account = JSON.parse(localStorage.getItem('account'))
    const userRole = account?.role.length > 0 ? account?.role[0] : ROLES.ROLE_MERCHANT_MANAGER
    if (userRole === ROLES.ROLE_SERVICE_ADMIN) {
      return true;
    }
    this.router.navigate(['/managements/top-screen']);
    return false;
  }
}
