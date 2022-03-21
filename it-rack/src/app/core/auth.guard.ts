import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { RoleModel } from '@app/favourite/role.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  roleModel: RoleModel;
  constructor(private router: Router) {
    this.roleModel = new RoleModel();
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url.replace(/\?.{1,}$/, '').toLowerCase();
    const menuAry = url.replace('/', '').split('/');
    let role = JSON.parse(localStorage.getItem('currentUser'));
    let menuStatus = false;

    if (!role) {
      this.router.navigate(['/login']);
      return false;
    } else {
      role = role.role;
    }

    if (menuAry[0] === 'dashboard') {
      menuStatus = true;
    } else {
      const menuItem = this.roleModel.model.filter((result) => result.url === url);
      if (menuItem.length === 0) {
        menuStatus = false;
      } else if (menuItem[0].role.indexOf(role) !== -1) {
        menuStatus = true;
      } else {
        menuStatus = false;
      }
    }

    if (localStorage.getItem('access_token') && menuStatus) {
      return true;
    }

    this.router.navigate(['404']);
    return false;
  }
}
