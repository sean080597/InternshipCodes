import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { API_URL } from '@app/_constants/api-url.enum';

@Injectable({
    providedIn: 'root',
})
export class HttpClientService {
    private API_ENDPOINT_SERVICES = environment.apiUrl + API_URL.SERVICES;

    constructor(private http: HttpClient) { }

    get(url: string, options?: any): Observable<any> {
        url = this.updateUrl(url);
        if (options && options.params) {
            options.params = this.modifySearchParams(options.params);
        }
        return this.http.get(url, options);
    }

    post(url: string, body: any = null, options?: any): Observable<any> {
        url = this.updateUrl(url);
        return this.http.post(url, body, options);
    }

    put(url: string, body: any = null, options?: any): Observable<any> {
        url = this.updateUrl(url);
        return this.http.put(url, body, options);
    }

    delete(url: string, options?: any): Observable<any> {
        url = this.updateUrl(url);
        return this.http.delete(url, options);
    }

    private updateUrl(req: string) {
        return this.API_ENDPOINT_SERVICES + req;
    }

    public modifySearchParams(params: any) {
        if (!params.filter) {
            return params;
        } else {
            for (const prop of Object.keys(params.filter)) {
                if (
                    params.filter[prop] !== null &&
                    typeof params.filter[prop] !== 'undefined'
                ) {
                    Object.assign(params, { [prop]: params.filter[prop] });
                }
            }
            delete params.filter;
            return params;
        }
    }
}
