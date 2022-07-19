import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@app/@core/services/auth.service';
import { Role } from '@app/@core/models/role';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
      //   this.router.navigate(['/error']);
      //   return false;
      // }
      // if (route.data.roles && !route.data.roles.some((t: Role) => currentUser.roles.includes(t))) {
      if(route.data.roles && !route.data.roles.some((t: Role) => currentUser.roles.includes(t))){
        if(currentUser.roles.includes(Role.Admin)){
          this.router.navigate(['/user-management']);
        }else if(currentUser.roles.includes(Role.Teacher)){
          this.router.navigate(['/question-bank']);
        }else{
          this.router.navigate(['/work-page']);
        }
      }
      // logged in so return true
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
