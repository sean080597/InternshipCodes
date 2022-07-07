import { Injectable } from '@angular/core';
import { ImageRegistered, ImageRegisteredResponse } from '@models/image-registered';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientService } from './http-client.service';
import { COMMON_CONFIGS, DESTINATION_TYPES, FLOWS, SCALEMODE_VALUES, SCALE_MODES, SORTING_OPTS } from '@app/_constants';
import { CommonService } from './common.service';
import imageCompression from 'browser-image-compression';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';
import { FilterSource } from '@app/_models/common';
import { API_URL } from '@app/_constants/api-url.enum';
import { ToastService } from '@app/shared/toast/toast.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NewRegistrationModalComponent } from '@app/managements/images-register/new-registration-modal/new-registration-modal.component';
import { ImageSelectModalComponent } from '@app/managements/images-register/image-select-modal/image-select-modal.component';
import { ImagesRegisterListModalComponent } from '@app/managements/images-register/images-register-list-modal/images-register-list-modal.component';
import { DisplayDestinationModalComponent } from '@app/managements/images-register/display-destination-modal/display-destination-modal.component';
import { ImageDetailsModalComponent } from '@app/managements/images-register/image-details-modal/image-details-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ImageRegisteredService {
  DISPLAY_DESTINATIONS = [
    {
      id: DESTINATION_TYPES.CUSTOMER_DISPLAY,
      image: '/assets/images/display_pos_machine.svg',
      title: this.translateService.instant('IMAGE_REGISTER.LB_CUSTOMER_DISPLAY'),
    },
    {
      id: DESTINATION_TYPES.RECEIPT_IMAGE,
      image: '/assets/images/display_receipt.svg',
      title: this.translateService.instant('IMAGE_REGISTER.LB_RECEIPT_IMAGE'),
    },
  ];

  ALIGNMENT_OPTIONS = {
    customerOptions: [
      {
        key: SCALE_MODES.VERTICAL,
        value: this.translateService.instant('LB_VERTICAL_WIDTH_ALIGN'),
      },
      {
        key: SCALE_MODES.HORIZONTAL,
        value: this.translateService.instant('LB_WIDTH_ALIGN'),
      },
      {
        key: SCALE_MODES.CENTER,
        value: this.translateService.instant('LB_CENTER_ALIGN'),
      },
    ],
    receiptOptions: [
      {
        key: SCALE_MODES.VERTICAL,
        value: this.translateService.instant('LB_WIDTH_ALIGN_REDUCTION'),
      },
      {
        key: SCALE_MODES.HORIZONTAL,
        value: this.translateService.instant('LB_UPPER_LEFT_ALIGN'),
      },
      {
        key: SCALE_MODES.CENTER,
        value: this.translateService.instant('LB_CENTER_ALIGN'),
      },
    ],
  };

  ALIGNMENT_CLASSES = [
    {
      typeId: DESTINATION_TYPES.CUSTOMER_DISPLAY,
      classes: [
        { key: SCALE_MODES.VERTICAL, value: SCALEMODE_VALUES.alignedVerticalWidth },
        { key: SCALE_MODES.HORIZONTAL, value: SCALEMODE_VALUES.alignedWidth },
        { key: SCALE_MODES.CENTER, value: SCALEMODE_VALUES.alignedCenter }
      ]
    },
    {
      typeId: DESTINATION_TYPES.RECEIPT_IMAGE,
      classes: [
        { key: SCALE_MODES.VERTICAL, value: SCALEMODE_VALUES.alignedWidthReduction },
        { key: SCALE_MODES.HORIZONTAL, value: SCALEMODE_VALUES.alignedUpperLeft },
        { key: SCALE_MODES.CENTER, value: SCALEMODE_VALUES.alignedTopCenter }
      ]
    }
  ]

  COMPRESS_OPTIONS = {
    maxSizeMB: 0.097,
    maxWidthOrHeight: 800,
    useWebWorker: true
  }

  defaultFilterSource: FilterSource = {
    imageLabel: null,
    registeredFrom: null,
    registeredTo: null,
    type: DESTINATION_TYPES.CUSTOMER_DISPLAY,
    sortBy: SORTING_OPTS.LAST_DESC
  };
  filterSource: FilterSource

  private _progressing = new BehaviorSubject<boolean>(false);
  readonly progressing$ = this._progressing.asObservable();
  private _progressingPercent = new BehaviorSubject<number>(0);
  readonly progressingPercent$ = this._progressingPercent.asObservable();
  private _progressingStatus = new BehaviorSubject<NzProgressStatusType>('active');
  readonly progressingStatus$ = this._progressingStatus.asObservable();

  constructor(
    private httpService: HttpClientService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private toast: ToastService,
    private modalService: BsModalService,
  ) {
    this.resetSearchFilter()
    this.commonService.currentFlow$.subscribe((curFlow: string) => {
      if (curFlow !== FLOWS.IMAGE) {
        this.resetSearchFilter()
      }
    })
  }

  showProgressing() {
    this._progressing.next(true);
  }

  hideProgressing() {
    this._progressing.next(false);
  }

  setProgressing(count: number) {
    this._progressingPercent.next(count);
  }

  increaseProgressing(count: number) {
    this._progressingPercent.next(this._progressingPercent.getValue() + count);
  }

  setProgressStatus(stt: NzProgressStatusType) {
    this._progressingStatus.next(stt);
  }

  startProgressing() {
    this._progressingPercent.next(0)
    this._progressing.next(true)
    this._progressingStatus.next('active')
  }

  public resetSearchFilter() {
    this.filterSource = { ...this.defaultFilterSource }
  }

  public getAllImageList(options = null): Observable<ImageRegisteredResponse> {
    const optionsData = options ?? { page: 1, pageSize: 50, type: DESTINATION_TYPES.CUSTOMER_DISPLAY, sortBy: SORTING_OPTS.LAST_DESC }
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/content`, { params: optionsData })
  }

  public getImageDetails(id): Observable<ImageRegistered> {
    return this.httpService.get(`${API_URL.SERVER_SERVICE}/content/${id}`);
  }

  public saveImageDetails(id, imageObj): Observable<ImageRegistered> {
    return this.httpService.put(`${API_URL.SERVER_SERVICE}/content/${id}`, imageObj);
  }

  public deleteImageDetails(id): Observable<any> {
    return this.httpService.delete(`${API_URL.SERVER_SERVICE}/content/${id}`);
  }

  public deleteMultiImages(idList: string[]): Observable<any> {
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/content/multi-delete`, idList);
  }

  public deleteAllImages(options): Observable<any> {
    const optionsData = options
    return this.httpService.delete(`${API_URL.SERVER_SERVICE}/content/all-delete`, { params: optionsData }).pipe(
      (res) => {
        return res;
      })
  }

  public submitImageRegistration(data): Observable<ImageRegistered> {
    return this.httpService.post(`${API_URL.SERVER_SERVICE}/content`, data);
  }

  public validateInputImageFile(file: File) {
    if (!this.checkImageExtension(file)) {
      this.toast.toastError(this.translateService.instant('ERR_MSG_ONLY_IMAGE_TYPES'))
      return false
    }

    // if (COMMON_CONFIGS.GIF_REGEX.test(file.name) && file.size > 102400) {
    //   this.toast.toastError(this.translateService.instant('ERR_MSG_EXCEEDED_LIMIT', { field: '画像', size: '100KB' }))
    //   return false
    // }
    return true
  }

  public checkImageExtension(file: File) {
    return COMMON_CONFIGS.IMAGE_REGEX.test(file.name)
  }

  async compressImageSize(file: File, requiredWidth: number, quality: number = 0.5): Promise<File> {
    if (quality < 0.1) {
      return null
    }
    const options = { ...this.COMPRESS_OPTIONS, initialQuality: quality }
    const compressedImg = await imageCompression(file, options)
    this.increaseProgressing(5)
    const { width } = await this.commonService.checkImageInfo(compressedImg)
    console.log('quality => ', quality, ' - width => ', width, ' - file size => ', file.size)
    if (width < requiredWidth) {
      return this.compressImageSize(file, requiredWidth, quality - 0.1)
    }
    return compressedImg
  }

  genScaleModeClassname(typeId: string, alignmentValue: SCALE_MODES) {
    const clazz = this.ALIGNMENT_CLASSES.find(t => t.typeId === typeId)?.classes
    return clazz.find(t => t.key === alignmentValue)?.value || null
  }

  openCreateImage(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(ImageSelectModalComponent, {
      class: 'modal-lg modal-dialog-centered modal-dialog-scrollable mh-95',
      ignoreBackdropClick: true,
      initialState
    });
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.subscribe(res => {
      if (res) callback ? callback(res) : () => {}
    })
  }

  openNewRegistModal(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(NewRegistrationModalComponent, {
      class: 'modal-xl modal-dialog-centered modal-dialog-scrollable mh-95',
      ignoreBackdropClick: true,
      initialState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.subscribe(res => {
      if (res) callback ? callback(res) : () => {}
    })
  }

  openImageRegistListModal(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(ImagesRegisterListModalComponent, {
      class: 'modal-xl modal-dialog-scrollable mh-95',
      ignoreBackdropClick: true,
      initialState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.subscribe(res => {
      if (res) callback ? callback(res) : () => {}
    })
  }

  openDisplayDestinationModal(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(DisplayDestinationModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.subscribe(res => {
      if (res) callback ? callback(res) : () => {}
    })
  }

  openImageDetailsModal(initialState, callback?: any) {
    const modal: BsModalRef = this.modalService.show(ImageDetailsModalComponent, {
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
