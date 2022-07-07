import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalObject } from '@app/shared/modal/modal.component';
import { ToastService } from '@app/shared/toast/toast.service';
import { COMMON_CONFIGS, SORTING_OPTS, FLOWS, HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { FilterSource } from '@app/_models/common';
import { Receipt } from '@app/_models/receipt';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { ReceiptService } from '@app/_services/receipt.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  @Input('isModal') isModal = false
  @Output() onConfirmed: EventEmitter<{ selectedImage: any }> = new EventEmitter()
  private unsubscribe = new Subject<void>();
  commonConfigs = COMMON_CONFIGS
  sortingOpts = SORTING_OPTS;
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

  allChecked = false;

  filterSource: FilterSource
  receiptList: Receipt[] = [];
  checkedList: string[] = []
  deleteModal: ModalObject;

  SERVICE_STATUS_OPT = [
    { value: 1, title: this.translateService.instant('LB_START') },
    { value: 2, title: this.translateService.instant('LB_IN_USE') },
    { value: 2, title: this.translateService.instant('LB_END') },
  ];
  onSearchCondition: any;
  keepSearch: boolean = true;
  constructor(
    private receiptService: ReceiptService,
    private router: Router,
    private translateService: TranslateService,
    private commonService: CommonService,
    private toast: ToastService,
    private operationService: OperationService,
  ) {
    this.commonService.btnStrikeOut.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.router.navigate(['managements/receipt/template']);
    });
    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      this.keepSearch = this.router.getCurrentNavigation().extras?.state['keepSearch']
    }
    this.filterSource = this.receiptService.filterSource

    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngOnInit(): void {
    if (!this.isModal) {
      this.commonService.addHeaderLeftCorner({ message: 'RECEIPT_LIST.RECEIPT_CREATION', btnName: 'BT_ADD_NEW' });
      this.commonService.setScreenID(SCREEN_IDS.ADS04001)
      this.commonService.setCurrentFlow(FLOWS.RECEIPT)
      this.initDeleteModal()
    }
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
    if (this.allChecked) this.checkedList = this.receiptList.map(t => t.id)
  }

  onDelete() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04007).subscribe()
    this.deleteModal.show()
  }

  sortChange(e) {
    this.filterSource.sortBy = e === this.sortingOpts.ASC ? this.sortingOpts.LAST_ASC : this.sortingOpts.LAST_DESC
    this.onSearchCondition = {...this.onSearchCondition, sortBy: this.filterSource.sortBy}
    this.keepCondition()
    // this.search(false)
  }

  receivePaging($event) {
    this.pagingConfig.currentPage = $event;
    this.onSearchCondition = {...this.onSearchCondition, page: this.pagingConfig.currentPage}
    this.keepCondition()
    this.search(false)
  }

  onEditItem(imageId: string) {
    if (this.isModal) return
    this.router.navigate(['managements/receipt/', imageId]);
  }

  onCreatedDateOK(result: Date | Date[] | null): void {
  }


  searchReceipt() {
    this.pagingConfig.currentPage = 1;// reset value default
    this.receiptList = [];
    this.search();
  }

  search(isChanged: boolean = true) {
    let options = isChanged
    ? {
      ...this.filterSource,
      receiptLabel: this.filterSource.receiptLabel?.trim(),
      page: this.pagingConfig.currentPage,
      pageSize: this.pagingConfig.itemsPerPage,
    }
    : this.onSearchCondition;
    Object.keys(options).forEach((key) => {
      if (!options[key]) { delete options[key] }
    });
    this.onSearchCondition = options
    this.receiptService.getAllReceipt(options).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availableElements = res.availableElements;
      this.receiptList = res.items;
      this.checkedList.length = 0;
      if (this.allChecked) {
        this.updateAllChecked()
      }
    });
  }

  keepCondition() {
    this.filterSource.receiptLabel = this.onSearchCondition?.receiptLabel
    this.filterSource.registeredFrom = this.onSearchCondition?.registeredFrom
    this.filterSource.registeredTo = this.onSearchCondition?.registeredTo
  }

  // for receipt list modal
  resetSearchFilter() {
    this.filterSource.receiptLabel = ''
    this.filterSource.registeredFrom = ''
    this.filterSource.registeredTo = ''
    this.search(true)
  }

  onCreatedDateFromChange(result: Date): void {
    this.filterSource.registeredFrom = !result ? result : moment(result).utc().format(this.commonConfigs.MOMENT_FORMAT_YYYY_MM_DD_d)
  }

  onCreatedDateToChange(result: Date): void {
    this.filterSource.registeredTo = !result ? result : moment(result).utc().format(this.commonConfigs.MOMENT_FORMAT_YYYY_MM_DD_d)
  }

  initDeleteModal() {
    this.deleteModal = {
      class: 'modal-lg modal-dialog-centered',
      topAlign: 'border-0',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      marginBottom: true,
      ignoreBackdropClick: true,
      confirm: async () => {
        if (this.allChecked) {
          this.receiptService.deleteAllReceipt(this.onSearchCondition).subscribe(res => {
            this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_DELETE'));
            this.receiptService.getAllReceipt().pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
              this.pagingConfig.availablePages = res.availablePages
              this.pagingConfig.currentPage = res.page;
              this.pagingConfig.availableElements = res.availableElements;
              this.receiptList = res.items;
            });
            this.allChecked = false
            this.checkedList.length = 0
          })
        }
        else this.receiptService.deleteMultiImages(this.checkedList).subscribe(res => {
          this.toast.toastSuccess(this.translateService.instant('SCC_MSG_DELETED'));
          this.checkedList.length = 0
          this.search()
        })
        this.deleteModal.hide();
      },
      cancel: async () => {
        this.deleteModal.hide();
      },
    };
  }

  // for modal only
  selectImage() {
    const confirmedImg = this.receiptList.find(t => t.id === this.checkedList[0])
    this.onConfirmed.emit({ selectedImage: confirmedImg })
  }
  openImageDetailsModal(imageId: string) {
    if(!this.isModal) return
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05013).subscribe()
    this.receiptService.openImageDetailsModal({ imageId }, (res) => {
      this.onConfirmed.emit({ selectedImage: this.receiptList.find(t => t.id === imageId) })
    })
  }
}
