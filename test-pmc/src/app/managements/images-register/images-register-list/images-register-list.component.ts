import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagingComponent } from '@app/shared/paging/paging.component';
import { COMMON_CONFIGS, DESTINATION_TYPES, SORTING_OPTS, FLOWS, HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { FilterSource } from '@app/_models/common';
import { ImageRegistered } from '@app/_models/image-registered';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ToastService } from '@app/shared/toast/toast.service';
import { ModalObject } from '@app/shared/modal/modal.component';
import { OperationService } from '@app/_services/operation.service';

@Component({
  selector: 'app-images-register-list',
  templateUrl: './images-register-list.component.html',
  styleUrls: ['./images-register-list.component.scss']
})
export class ImagesRegisterListComponent implements OnInit {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  @ViewChild(PagingComponent, { static: true }) paging: PagingComponent;
  @Input('isModal') isModal = false
  @Input('typeIdOnly') typeIdOnly: string;
  @Output() onConfirmed: EventEmitter<{ selectedImage: any }> = new EventEmitter()
  private unsubscribe = new Subject<void>();
  commonConfigs = COMMON_CONFIGS
  destinationTypes = DESTINATION_TYPES
  sortingOpts = SORTING_OPTS
  sort = SORTING_OPTS.DESC
  pagingConfig = {
    availablePages: 0,
    itemsPerPage: 120,
    currentPage: 1,
    availableElements: 1,
  }
  filterSettings = {
    sortByCreatedDate: true,
    searchByImageLabel: true,
    filterCreatedDate: true,
    filterDisplayDestination: true,
    countTotal: true,
  }
  SERVICE_STATUS_OPT = [
    { value: 1, title: this.translateService.instant('LB_START') },
    { value: 2, title: this.translateService.instant('LB_IN_USE') },
    { value: 2, title: this.translateService.instant('LB_END') }
  ]
  filterSource: FilterSource
  imagesList: ImageRegistered[] = [];
  checkedList: string[] = []
  deleteModal: ModalObject;
  allChecked: boolean;
  onSearchCondition: any;
  keepSearch: boolean = true;

  constructor(
    private router: Router,
    private imageRegisteredService: ImageRegisteredService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private toast: ToastService,
    private operationService: OperationService,
  ) {
    this.commonService.btnStrikeOut.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.createImage();
    });
    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      this.keepSearch = this.router.getCurrentNavigation().extras?.state['keepSearch']
    }
    this.filterSource = this.imageRegisteredService.filterSource
    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngOnInit(): void {
    if (!this.isModal) {
      this.commonService.addHeaderLeftCorner({ message: 'IMAGE_REGISTER.TT_IMAGE_MANAGEMENT', btnName: 'BT_ADD_NEW' });
      this.commonService.setScreenID(SCREEN_IDS.ADS03001)
      this.commonService.setCurrentFlow(FLOWS.IMAGE)
      this.initDeleteModal()
    }
    this.filterSource.type = this.typeIdOnly ?? this.filterSource.type
    if (this.keepSearch) {
      this.search();
    }
    else {
      this.resetSearchFilter()
      this.search();
    }
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if (!this.isModal) this.commonService.removeHeaderLeftCorner();
    this.commonService.setActionsBarTemplate(null)
  }

  onChecked(id: string) {
    if (this.checkedList.includes(id)) this.checkedList.splice(this.checkedList.indexOf(id), 1)
    else this.checkedList.push(id)
    this.allChecked = false;
  }

  updateAllChecked(): void {
    this.checkedList.length = 0
    if (this.allChecked) this.checkedList = this.imagesList.map(t => t.id)
  }

  createImage() {
    this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS03005).subscribe()
    this.imageRegisteredService.openDisplayDestinationModal({}, (res) => {
      if (res && res.key === 'openCreateImageModal') {
        const typeIdOnly = res.selectedType
        const screenId = res.selectedType === DESTINATION_TYPES.CUSTOMER_DISPLAY ? SCREEN_IDS.ADS03008 : SCREEN_IDS.ADS03009
        this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, screenId).subscribe()
        this.imageRegisteredService.openCreateImage({ showSelection: false }, (res) => {
          if (res && res.key === 'openNewImageModal') {
            this.router.navigate(['/managements/image-gallery/image-new-registration'], { queryParams: { typeIdOnly }, state: { dragDropFile: res.dragDropFile } })
          }
        })
      }
    })
  }

  onRegisteredFromChange(result: Date): void {
    this.filterSource.registeredFrom = !result ? result : moment(result).utc().format(this.commonConfigs.MOMENT_FORMAT_YYYY_MM_DD_d)
  }

  onRegisteredToChange(result: Date): void {
    this.filterSource.registeredTo = !result ? result : moment(result).utc().format(this.commonConfigs.MOMENT_FORMAT_YYYY_MM_DD_d)
  }

  onCreatedDateOK(result: Date | Date[] | null): void {
  }

  // for image list modal
  resetSearchFilter() {
    this.filterSource.imageLabel = ''
    this.filterSource.registeredFrom = ''
    this.filterSource.registeredTo = ''
    this.search(true)
  }

  receivePaging($event) {
    this.pagingConfig.currentPage = $event;
    this.onSearchCondition = {...this.onSearchCondition, page: this.pagingConfig.currentPage}
    this.keepCondition()
    this.search(false)
  }

  sortChange(e) {
    this.filterSource.sortBy = e === this.sortingOpts.ASC ? this.sortingOpts.LAST_ASC : this.sortingOpts.LAST_DESC
    this.onSearchCondition = {...this.onSearchCondition, sortBy: this.filterSource.sortBy}
    this.keepCondition()
    // this.search(false)
  }

  keepCondition() {
    this.filterSource.imageLabel = this.onSearchCondition?.imageLabel
    this.filterSource.registeredFrom = this.onSearchCondition?.registeredFrom
    this.filterSource.registeredTo = this.onSearchCondition?.registeredTo
  }

  searchImage() {
    this.pagingConfig.currentPage = 1;// reset value default
    this.imagesList = [];
    this.search();
  }

  search(isChanged: boolean = true) {
    let options = isChanged
    ? {
      ...this.filterSource,
      imageLabel: this.filterSource.imageLabel?.trim(),
      page: this.pagingConfig.currentPage,
      pageSize: this.pagingConfig.itemsPerPage,
    }
    : this.onSearchCondition;
    Object.keys(options).forEach(key => {
      if (!options[key]) { delete options[key] }
    })
    this.onSearchCondition = options;
    this.imageRegisteredService.getAllImageList(options).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availableElements = res.availableElements;
      this.imagesList = res.items;
      this.checkedList.length = 0
      if (this.allChecked) {
        this.updateAllChecked()
      }
    })
  }


  desTypeChange(type: string) {
    this.filterSource.type = type
    this.search(true);
    this.paging.goToPage('first')
  }

  initDeleteModal() {
    this.deleteModal = {
      class: 'modal-lg modal-dialog-centered',
      topAlign: 'border-0',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      marginBottom: true,
      confirm: async () => {
        if (this.allChecked) {
          this.imageRegisteredService.deleteAllImages(this.onSearchCondition).subscribe(res => {
            this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_DELETE'));
            this.imageRegisteredService.getAllImageList().pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
              this.pagingConfig.availablePages = res.availablePages
              this.pagingConfig.currentPage = res.page;
              this.pagingConfig.availableElements = res.availableElements;
              this.imagesList = res.items;
            });
            this.allChecked = false
            this.checkedList.length = 0
          })
        } else {
          this.imageRegisteredService.deleteMultiImages(this.checkedList).subscribe(res => {
            this.toast.toastSuccess(this.translateService.instant('SCC_MSG_DELETED'))
            this.search()
          })
        }
        this.deleteModal.hide();
      },
      cancel: async () => {
        this.deleteModal.hide();
      },
    };
  }

  onDelete() {
    this.deleteModal.show()
  }

  onEditItem(imageId: string) {
    if (this.isModal) return
    this.router.navigate(['managements/image-gallery/details/', imageId]);
  }

  // for modal only
  selectImage() {
    const confirmedImg = this.imagesList.find(t => t.id === this.checkedList[0])
    this.onConfirmed.emit({ selectedImage: confirmedImg })
  }
  openImageDetailsModal(imageId: string) {
    if(!this.isModal) return
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, this.typeIdOnly === this.destinationTypes.CUSTOMER_DISPLAY ? SCREEN_IDS.ADS05012 : SCREEN_IDS.ADS04014).subscribe()
    this.imageRegisteredService.openImageDetailsModal({ imageId }, (res) => {
      this.onConfirmed.emit({ selectedImage: this.imagesList.find(t => t.id === imageId) })
    })
  }
}
