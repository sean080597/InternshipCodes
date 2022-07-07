import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '@app/_services/common.service';
import { OperationTable } from '@app/_models/managements/operation.model';
import { FilterSource } from '@app/_models/common';
import { OperationService } from '@app/_services/operation.service';
import { COMMON_CONFIGS, FLOWS, HISTORY_ACTIONS, INPUT_CONFIGS, SORTING_OPTS } from '@app/_constants';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanySelectionComponent } from "@app/managements/user/company-selection/company-selection.component";
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { PagingService } from '@app/_services/paging.service';
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {
  public inputConfigs = INPUT_CONFIGS
  public commonConfigs = COMMON_CONFIGS
  public sort = SORTING_OPTS.DESC
  public sortingOpts = SORTING_OPTS
  public unsubscribe = new Subject<void>();
  public operationTables: OperationTable[] = [];
  public pagingConfig = {
    availablePages: 0,
    itemsPerPage: 120,
    currentPage: 1,
    availableElements: 0
  }
  onSearchEmail = '';
  public filterSettings = {
    displayPerPage: true,
    sortByOperationDate: true,
    filterUniqueId: true,
    countTotal: true
  }
  onSearchCondition: any;

  public filterSource: FilterSource
  public bsModalRef: BsModalRef;
  selectedCompany: {
    companyName: '',
    id: number
  }

  constructor(
    private modalService: BsModalService,
    private commonService: CommonService,
    private operationService: OperationService,
    private pagingService: PagingService,
  ) {
    this.commonService.addHeaderLeftCorner({ message: 'OPERATION.HEADER' });
    this.filterSource = this.operationService.filterSource
  }

  ngOnInit() {
    this.commonService.setScreenID(SCREEN_IDS.ADS09002)
    this.search();
    this.commonService.setCurrentFlow(FLOWS.OPERATION)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.removeHeaderLeftCorner();
  }


  genStartElNumber(){
    return this.pagingService.genStartElNumber(this.pagingConfig.currentPage, this.pagingConfig.itemsPerPage)
  }

  genEndElNumber(){
    return this.pagingService.genEndElNumber(this.pagingConfig.currentPage, this.pagingConfig.itemsPerPage, this.pagingConfig.availableElements)
  }

  receivePaging($event) {
    this.pagingConfig.currentPage = $event;
    this.onSearchCondition = {...this.onSearchCondition, page: this.pagingConfig.currentPage}
    this.keepCondition()
    this.search(false)
  }

  sortChange(e) {
    this.filterSource.sortBy = e === this.sortingOpts.ASC ? this.sortingOpts.OPERATION_ASC : this.sortingOpts.OPERATION_DESC
    this.onSearchCondition = {...this.onSearchCondition, sortBy: this.filterSource.sortBy}
    this.keepCondition()
    // this.search(false)
  }

  keepCondition() {
    this.filterSource.emailAddress = this.onSearchCondition?.emailAddress
    this.filterSource.registeredFrom = this.onSearchCondition?.registeredFrom
    this.filterSource.registeredTo = this.onSearchCondition?.registeredTo
  }

  selection(onSelectedCompany): void {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS96001).subscribe()
    this.bsModalRef = this.modalService.show(CompanySelectionComponent, {
      initialState: onSelectedCompany,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.commonService.setScreenID(SCREEN_IDS.ADS09002)
      this.selectedCompany = res.selectedCompany;
      if (this.selectedCompany) {
        this.filterSource.companyId = res.selectedCompany.id;
        this.search()
      }
    });
  }

  searchOperation() {
    this.pagingConfig.currentPage = 1;// reset value default
    this.operationTables = [];
    this.search();
  }

  search(isChanged: boolean = true) {
    let options = isChanged
    ? {
      ...this.filterSource,
      emailAddress: this.filterSource.emailAddress.trim(),
      page: this.pagingConfig.currentPage,
      pageSize: this.pagingConfig.itemsPerPage,
    }
    : this.onSearchCondition;
    Object.keys(options).forEach((key) => {
      if (!options[key]) { delete options[key] }
    });
    this.onSearchCondition = options
    this.operationService.getOperationList(options).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.operationTables = res.items;
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page
      this.pagingConfig.availableElements = res.availableElements
    })
  }

  onRegisteredFromChange(result: Date): void {
    this.filterSource.registeredFrom = !result ? result : moment(result).second(0).utc().format()
  }

  onRegisteredToChange(result: Date): void {
    this.filterSource.registeredTo = !result ? result : moment(result).second(0).add(59, 'seconds').utc().format()
  }

  onCreatedDateOK(result: Date | Date[] | null): void {
  }
}
