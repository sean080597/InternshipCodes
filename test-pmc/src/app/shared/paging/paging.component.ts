import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SORTING_OPTS } from '@app/_constants';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit, OnChanges {
  @Input('itemsPerPage') itemsPerPage: number;
  @Input('totalItems') totalItems: number;
  @Input('availablePages') availablePages: number;
  @Input('page') page: number;
  @Input('sort') sort: string;
  @Input() filterSource: any = {};
  @Input() filterSettings: any = null;
  @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() pagingEvent = new EventEmitter<{}>();



  filterSettingsDefault: any = {
    sortByCreatedDate: false,
    displayPerPage: false,
    sortByUniqueId: false,
    sortByUniqueTime: false,
    filterPlayRisutoraberu: false,
    searchByImageLabel: false,
    filterReceiptLabel: false,
    filterCreatedDate: false,
    filterItemSelection: false,
    filterDisplayDestination: false,
    specifyFilter: false,
    createUser: false,
    // delivery filter
    filterUniqueId: false,
    filterCompanyName: false,
    filterRegisteredPlaylist: false,
    filterStatusNotificationDate: false,
    filterServiceStatus: false,
    searchByPlaylistLabel: false,
    sortByLastDate: false,
    createUserBtn: false,
    countTotal: false,
    selectMonthBtn: false
  };
  disablePrevious: boolean;
  disableNext: boolean;

  constructor(
    private operationService: OperationService,
    private commonService: CommonService
  ) {

   }
  ngOnChanges(changes: SimpleChanges): void {
    this.checkDisablePagingButton();
  }

  ngOnInit(): void {
    this.checkDisablePagingButton()
    this.filterSettings = this.filterSettings
      ? this.filterSettings
      : this.filterSettingsDefault;
  }

  ngOnChange() {
    this.checkDisablePagingButton()
  }

  onSortChange() {
    this.page = 1;
    this.sortChange.emit(this.sort);
    this.processPagingUI();
  }

  checkDisablePagingButton() {
    if (this.page === 1) {
      this.disablePrevious = true;
    }
    else {
      this.disablePrevious = false;
    }
    if (this.page === this.availablePages || this.availablePages === 0) {
      this.disableNext = true;
    }
    else {
      this.disableNext = false;
    }
  }

  processPagingUI() {
    this.pagingEvent.emit(this.page);
    this.checkDisablePagingButton()
  }

  goToPage(type) {
    this.commonService.gotoTop()
    switch (type) {
      case 'first' : {
        this.page = 1;
        break
      }
      case 'previous' : {
        this.page -= 1;
        break
      }
      case 'next' : {
        this.page += 1;
        break
      }
      case 'last' : {
        this.page = this.availablePages;
        break
      }
    }
    this.operationService.saveOperation('PAGING').subscribe();
    this.processPagingUI();
  }

  genStartElNumber() {
    return this.availablePages === 0 ? 0 : 1 + (this.itemsPerPage * (this.page - 1))
  }

  genEndElNumber() {
    return this.page * this.itemsPerPage < this.totalItems ? this.itemsPerPage * this.page : this.totalItems
  }

  pageChanged(event) {
    this.page = event;
  }
}
