import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  constructor(private http: HttpClient, public global: SharedService) {}

  setHelpURL(filterList: {}) {
    const url = `${this.global.userAppUrl}/config/updateconfig`;
    const data = { id: 'help_page', name: JSON.stringify(filterList) };
    return this.http.post(url, data);
  }

  getHelpURL() {
    const url = `${this.global.userAppUrl}/config/getconfig`;
    const data = { id: 'help_page' };
    return this.http.post(url, data);
  }

  getNoti() {
    const url = `${this.global.userAppUrl}/notification/startup`;
    return this.http.get(url);
  }

  setNoti(filterList: {}) {
    const url = `${this.global.userAppUrl}/notification/startup`;
    return this.http.post(url, filterList);
  }
}
