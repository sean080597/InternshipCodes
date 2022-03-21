import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '@shared/shared.service';
import { GeneralResponseBody } from '@shared/shared.model';

export interface Users {
  id: string;
  name: string;
}

export interface UsersApi {
  items: Users[];
  total_count: number;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private http: HttpClient, private global: SharedService) {}

  public setFavorite(itemId?: string, isFavorited: boolean = true, viewId?: string, secondItemId: string = ''): Observable<GeneralResponseBody> {
    const toggleAction = isFavorited ? 'add' : 'del';
    const url = `${this.global.userAppUrl}/user/favorite/${toggleAction}Favorite`;
    const data = {
      viewType: viewId,
      itemId: itemId,
      itemId2: secondItemId,
    };
    return this.http.post<GeneralResponseBody>(url, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class DynamicService {
  private dataStore: any[];

  get data() {
    return this.dataStore;
  }

  constructor(private http: HttpClient, private favoriteService: FavoriteService, private global: SharedService) {}

  select(active?: any, direction?: any, pageIndex?: any, pageSize?: any, viewId?: any) {
    const url = `${this.global.userAppUrl}/user/favorite/showFavoriteView`;
    const page = { pageRequest: { sortName: active, sortExpression: direction, pageSize, pageIndex: pageIndex + 1 } };
    const data = { viewType: viewId, ...page };
    return this.http.post(url, data);
  }

  favorable(rowId?: any, iconValue?: any, viewId?: any, withId?: any) {
    return this.favoriteService.setFavorite(rowId, iconValue, viewId, withId);
  }

  export(viewId?: any) {
    let viewType = '';
    if (viewId === '1') {
      viewType = 'container';
    } else if (viewId === '2') {
      viewType = 'shipment';
    } else if (viewId === '3') {
      viewType = 'material';
    }
    const url = `${this.global.baseAppUrl}/export/${viewType}favorite`;
    const data = { viewType: viewId };
    return this.http.post(url, data, { observe: 'response', responseType: 'blob' });
  }

  remarkSelect(uniqueNumber?: any) {
    const data = {
      uniqueNumber,
    };
    const url = `${this.global.baseAppUrl}/remarks/all`;
    return this.http.post(url, data);
  }

  remarkSave(v: any, uniqueNumber?: any, remarkNumber?: any, viewType?: any) {
    const remarkName = JSON.parse(localStorage.getItem('currentUser')).fullName;
    const data = {
      name: remarkName,
      type: viewType,
      content: v,
      remarkNumber,
      uniqueNumber,
    };
    const url = `${this.global.baseAppUrl}/remarks/save`;
    return this.http.post(url, data);
  }

  add(data) {
    const newData = Object.assign(this.getLastId(), data);
    this.dataStore.push(newData);
  }

  delete(data) {
    const result = this.dataStore.filter((v, k) => {
      if (v.id === data.id) {
        return v;
      }
    });

    const i = this.dataStore.indexOf(result[0]);
    this.dataStore = [...this.dataStore.slice(0, i), ...this.dataStore.slice(i + 1)];
  }

  count() {
    return this.dataStore.length;
  }

  getLastId() {
    const pop = this.dataStore.pop();
    const id = pop.id;

    return { id };
  }

  exportSearch(filterList: {}) {
    const url = `${this.global.baseAppUrl}/export/search`;
    const data = { ...filterList };
    return this.http.post(url, data, { observe: 'response', responseType: 'blob' });
  }
}
