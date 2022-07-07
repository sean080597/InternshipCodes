import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClientService } from './http-client.service';
import { PlaylistModel, PlaylistResponse } from '@app/_models/playlist';
import { DESTINATION_TYPES, FLOWS, SORTING_OPTS } from '@app/_constants';
import { FilterSource } from '@app/_models/common';
import { API_URL } from '@app/_constants/api-url.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  defaultFilterSource: FilterSource = {
    playlistLabel: null,
    registeredFrom: null,
    registeredTo: null,
    sortBy: SORTING_OPTS.LAST_DESC,
  };
  filterSource: FilterSource

  constructor(private httpService: HttpClientService, private commonService: CommonService) {
    this.resetSearchFilter()
    this.commonService.currentFlow$.subscribe((curFlow: string) => {
      if (curFlow !== FLOWS.PLAYLIST) {
        this.resetSearchFilter()
      }
    })
  }

  public resetSearchFilter() {
    this.filterSource = { ...this.defaultFilterSource }
  }

  public getAllPlaylist(options = null): Observable<PlaylistResponse> {
    const optionsData = options ?? { page: 1, pageSize: 120, sortBy: SORTING_OPTS.LAST_DESC }
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/playlist`, { params: optionsData }).pipe(
      map((res) => {
        res.items = res.items.map(i => {
          return {
            ...i,
            playlistData: {
              standbyImages: [i.playlistData.standbyImage01, i.playlistData.standbyImage02, i.playlistData.standbyImage03],
              afterPaymentImage: i.playlistData.afterPaymentImage,
              beforePaymentImage: i.playlistData.beforePaymentImage,
              receiptImage: i.playlistData.receiptImage,
            }
          }
        })
        return res;
      })
    );
  }

  public deletePlaylist(id): Observable<any> {
    return this.httpService.delete(`${API_URL.SERVER_SERVICE}/playlist/${id}`);
  }

  public deleteAllPlaylist(options): Observable<any> {
    const optionsData = options
    return this.httpService.delete(`${API_URL.SERVER_SERVICE}/playlist/all-delete`, { params: optionsData }).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public deleteMultiPlaylist(listId): Observable<any> {
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/playlist/multi-delete`, listId);
  }

  public updatePlaylist(id, data): Observable<any> {
    return this.httpService.put(`${API_URL.SERVER_SERVICE}/playlist/${id}`, data);
  }

  public getPlaylistDetail(id): Observable<any> {
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/playlist/${id}`).pipe(
      map(res => {
        return {
          ...res,
          playlistData: {
            standbyImages: [res.playlistData.standbyImage01, res.playlistData.standbyImage02, res.playlistData.standbyImage03],
            afterPaymentImage: res.playlistData.afterPaymentImage,
            beforePaymentImage: res.playlistData.beforePaymentImage,
            receiptImage: res.playlistData.receiptImage,
          }
        }
      })
    );
  }

  public createPlaylist(data): Observable<PlaylistModel> {
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/playlist`, data);
  }
}
