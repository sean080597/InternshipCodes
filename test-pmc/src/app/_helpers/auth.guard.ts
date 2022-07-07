import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { Account } from '@app/_models/account/account.model';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
    ) {}

    canActivate() {
        const account: Account = JSON.parse(localStorage.getItem('account'))
        if(account?.token) {
            return true;
        }
         this.router.navigate(['/account/login']);
        return false;
    }
}
