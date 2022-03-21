import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ssoUrl: any = {};

  constructor(private http: HttpClient, public global: SharedService) {}

  login() {
    const url = `${this.global.authAppUrl}/auth/sso`;
    return this.http.get(url);
  }
}
