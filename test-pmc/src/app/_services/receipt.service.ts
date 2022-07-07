import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { COMMON_CONFIGS, CONTENT_TYPES, DESTINATION_TYPES, FLOWS, INPUT_CONFIGS, RECEIPT_INPUT_TYPES, SORTING_OPTS } from '@app/_constants';
import { Receipt, ReceiptContentData, ReceiptRequest, ReceiptResponse } from '@app/_models/receipt';
import {
  ImageRegistered,
  ImageRegisteredResponse,
} from '@app/_models/image-registered';
import { FilterSource } from '@app/_models/common';
import { API_URL } from '@app/_constants/api-url.enum';
import { CommonService } from './common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReceiptListModalComponent } from '@app/managements/receipt/receipt-list-modal/receipt-list-modal.component';
import { ReceiptDetailsModalComponent } from '@app/managements/receipt/receipt-details-modal/receipt-details-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  defaultFilterSource: FilterSource = {
    receiptLabel: null,
    registeredFrom: null,
    registeredTo: null,
    type: DESTINATION_TYPES.CUSTOMER_DISPLAY,
    sortBy: SORTING_OPTS.LAST_DESC,
  };
  filterSource: FilterSource

  constructor(
    private httpService: HttpClientService,
    private commonService: CommonService,
    private modalService: BsModalService,
  ) {
    this.resetSearchFilter()
    this.commonService.currentFlow$.subscribe((curFlow: string) => {
      if (curFlow !== FLOWS.RECEIPT) {
        this.resetSearchFilter()
      }
    })
  }

  public resetSearchFilter() {
    this.filterSource = { ...this.defaultFilterSource }
  }

  public getAllReceipt(options = null): Observable<any> {
    const optionsData = options ?? { page: 1, pageSize: 23, sortBy: SORTING_OPTS.LAST_DESC }
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/receipt`, { params: optionsData }).pipe(
      map((res: ReceiptResponse) => {
        return res;
      })
    );
  }

  public getAllTemplate(options = null): Observable<any> {
    const optionsData = options ?? { page: 1, pageSize: 23, sortBy: SORTING_OPTS.LAST_ASC }
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/receipt-template`,
      { params: optionsData }
    );
  }

  public getReceiptTemplateDetail(id): Observable<any> {
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/receipt-template/${id}`);
  }

  public deleteReceipt(id): Observable<any> {
    return this.httpService.delete(`${API_URL.SERVER_SERVICE}/receipt/${id}`);
  }

  public deleteMultiImages(idList: string[]): Observable<any> {
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/receipt/multi-delete`, idList);
  }

  public deleteAllReceipt(options): Observable<any> {
    const optionsData = options ?? { page: 1, pageSize: 120, sortBy: SORTING_OPTS.LAST_DESC }
    return this.httpService.delete(`${API_URL.SERVER_SERVICE}/receipt/all-delete`, { params: optionsData }).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public updateReceipt(id, data): Observable<any> {
    return this.httpService.put(`${API_URL.SERVER_SERVICE}/receipt/${id}`, data);
  }

  public getReceiptDetail(id): Observable<any> {
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/receipt/${id}`);
  }

  public createReceipt(data): Observable<ReceiptRequest> {
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/receipt`, data);
  }

  public saveImageDetails(id, imageObj): Observable<Receipt> {
    return this.httpService.put(`${API_URL.SERVER_SERVICE}/content/${id}`, imageObj);
  }

  public getAllReceiptImage(
    options: { page: number; pageSize: number; type: string } = {
      page: 1,
      pageSize: 5,
      type: DESTINATION_TYPES.RECEIPT_IMAGE,
    }
  ): Observable<ImageRegistered[]> {
    return this.httpService
      .get(`${API_URL.SERVER_SERVICE}/content`, { params: options })
      .pipe(map((res: ImageRegisteredResponse) => res.items));
  }

  public genContentData(inputType: string, characterInputTemp: string, thumbnailImagePath: string) {
    let dataType: CONTENT_TYPES = CONTENT_TYPES.TEXT
    let dataScale = 0
    let data = []
    let txts = []
    switch (inputType) {
      case RECEIPT_INPUT_TYPES.STANDARD:
        dataScale = 1
        txts = characterInputTemp.split(COMMON_CONFIGS.BREAK_LINE_REGEX)
        data = this.commonService.splitStrOrArray(txts, INPUT_CONFIGS.HALF_INPUT_STANDARD)
        break;
      case RECEIPT_INPUT_TYPES.FOUR_TIMES:
        dataScale = 4
        txts = characterInputTemp.split(COMMON_CONFIGS.BREAK_LINE_REGEX)
        data = this.commonService.splitStrOrArray(txts, INPUT_CONFIGS.HALF_INPUT_4TIMES)
        break;
      case RECEIPT_INPUT_TYPES.IMAGE_SELECTION:
        dataType = CONTENT_TYPES.IMAGE
        dataScale = 1
        data.push(thumbnailImagePath)
        break;
    }

    const arr = []
    if (data.length > 0) {
      data.forEach(item => {
        const contentData: ReceiptContentData = { contentType: dataType, scale: dataScale, position: 1, data: item }
        arr.push(contentData)
      })
    }
    return arr
  }

  openReceiptListModal(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(ReceiptListModalComponent, {
      class: 'modal-xl modal-dialog-scrollable mh-95',
      ignoreBackdropClick: true,
      initialState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.subscribe(res => {
      if (res) callback ? callback(res) : () => {}
    })
  }

  openImageDetailsModal(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(ReceiptDetailsModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.subscribe(res => {
      if (res) callback ? callback(res) : () => {}
    })
  }
}
