import { Injectable } from '@angular/core';
import { FLOWS, SORTING_OPTS } from '@app/_constants';
import { API_URL } from '@app/_constants/api-url.enum';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { FilterSource } from '@app/_models/common';
import { OperationResponse, OperationTable } from '@app/_models/managements/operation.model';
import { finalize, map, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  defaultFilterSource: FilterSource = {
    emailAddress: '',
    registeredFrom: null,
    registeredTo: null,
    sortBy: SORTING_OPTS.OPERATION_DESC
  };
  filterSource: FilterSource

  constructor(
    private httpService: HttpClientService,
    private commonService: CommonService
  ) {
    this.resetSearchFilter()
    this.commonService.currentFlow$.subscribe((curFlow: string) => {
      if (curFlow !== FLOWS.OPERATION) {
        this.resetSearchFilter()
      }
    })
  }

  public resetSearchFilter() {
    this.filterSource = { ...this.defaultFilterSource }
  }

  public getOperationList(options = null): Observable<OperationResponse> {
    const optionsData = options ?? { page: 1, pageSize: 50 }
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/operation-history`, { params: optionsData })
  }

  public saveOperation(action: string): Observable<any> {
    const data = { action: action }
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/operation-history`, data);
  }

  public saveOperationWithScreenId(action: string, screenId: SCREEN_IDS, resetScreenId?: SCREEN_IDS): Observable<any> {
    this.commonService.setScreenID(screenId)
    const data = { action: action }
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/operation-history`, data).pipe(finalize(() => {
      if (resetScreenId) {
        this.commonService.setScreenID(resetScreenId)
      }
    }));
  }

  public saveOperationKeepCurrentScreenId(action: string, screenId: SCREEN_IDS): Observable<any> {
    const curScreenId = SCREEN_IDS[this.commonService.getScreenId()]
    return this.saveOperationWithScreenId(action, screenId, curScreenId)
  }
}
