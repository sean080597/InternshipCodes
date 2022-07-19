import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class HttpClientService {
    private API_ENDPOINT = environment.apiUrl;

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
        return this.API_ENDPOINT + req;
    }

    private modifySearchParams(params: any) {
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
