import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '@app/_services/playlist.service';
import { TranslateService } from '@ngx-translate/core';
import { COMMON_CONFIGS, FLOWS, HISTORY_ACTIONS, SORTING_OPTS } from '@app/_constants';
import * as moment from 'moment';
import { CommonService } from '@app/_services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { FilterSource } from '@app/_models/common';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OperationService } from '@app/_services/operation.service';
import { ModalObject } from '@app/shared/modal/modal.component';
import { ToastService } from '@app/shared/toast/toast.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  deleteModal: ModalObject;
  private unsubscribe = new Subject<void>();
  commonConfigs = COMMON_CONFIGS
  sortingOpts = SORTING_OPTS;
  bsModalRef: BsModalRef;

  sort = 'desc'
  pagingConfig = {
    availablePages: 0,
    availableElements: 1,
    itemsPerPage: 120,
    currentPage: 1,
  };
  filterSettings = {
    sortByCreatedDate: true,
    filterCreatedDate: true,
    countTotal: true
  }
  allChecked = false;
  checkedList: string[] = []

  filterSource: FilterSource

  playlistList: any = [];
  playlistFormModalObj: any;
  public loading = false;
  isNullList: boolean = false;
  onSearchCondition: any = {
    page: 1,
    pageSize: 120,
    playlistLabel: '',
    registeredFrom: '',
    registeredTo: '',
    sortBy: 'LAST_UPDATE_DATE_DESC',
    type: ''
  };
  keepSearch: boolean = true;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private translateService: TranslateService,
    private playlistService: PlaylistService,
    private commonService: CommonService,
    private toast: ToastService,
    private operationService: OperationService,
  ) {
    this.commonService.addHeaderLeftCorner({
      message: 'TT_PLAYLIST_MANAGEMENT',
      btnName: 'BT_ADD_NEW'
    });
    this.commonService.btnStrikeOut.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.createPlaylist();
    });
    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      this.keepSearch = this.router.getCurrentNavigation().extras?.state['keepSearch']
    }
    this.filterSource = this.playlistService.filterSource
    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS05001)
    this.commonService.setCurrentFlow(FLOWS.PLAYLIST)
    this.initDeleteModal();
    if (this.keepSearch) {
      this.checkNullListData()
      this.search();
    }
    else {
      this.keepSearch = true
      this.keepCondition()
      this.checkNullListData()
    }
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.removeHeaderLeftCorner();
    this.commonService.setActionsBarTemplate(null)
  }

  initModal() {
    this.playlistFormModalObj = {
      class: 'modal-lg',
      title: 'TT_FILTER_BOX',
      textConfirm: 'BT_SEARCH',
      contentFloatLeft: false,
      hideFooter: false,
      ignoreBackdropClick: true,
      showBtnDemo: false,
      confirm: async () => {
      }
    };
  }

  initDeleteModal() {
    this.deleteModal = {
      class: 'modal-lg modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      marginBottom: true,
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      confirm: async () => {
        if (this.allChecked) {
          this.playlistService.deleteAllPlaylist(this.onSearchCondition).subscribe(res => {
            this.commonService.setScreenID(SCREEN_IDS.ADS05001)
            this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_DELETE'));
            this.playlistService.getAllPlaylist().pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
              this.pagingConfig.availablePages = res.availablePages
              this.pagingConfig.currentPage = res.page;
              this.pagingConfig.availableElements = res.availableElements;
              this.playlistList = res.items;
            });
            this.allChecked = false;
            this.checkNullListData(); this.checkedList.length = 0
          })
        }
        else this.playlistService.deleteMultiPlaylist(this.checkedList).subscribe(res => {
          this.commonService.setScreenID(SCREEN_IDS.ADS05001)
          this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_DELETE'));
          this.checkNullListData(); this.checkedList.length = 0})
        this.deleteModal.hide();
      },
      cancel: async () => {
        this.commonService.setScreenID(SCREEN_IDS.ADS05001)
        this.deleteModal.hide();
      },
    };
  }

  createPlaylist() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05003).subscribe()
    this.router.navigate(['managements/playlist/create']);
  }

  sortChange(e) {
    this.filterSource.sortBy = e === this.sortingOpts.ASC ? this.sortingOpts.LAST_ASC : this.sortingOpts.LAST_DESC
    this.onSearchCondition = {...this.onSearchCondition, sortBy: this.filterSource.sortBy}
    this.keepCondition()
    // this.search(false)
  }

  receivePaging(e) {
    this.pagingConfig.currentPage = e;
    this.onSearchCondition = {...this.onSearchCondition, page: this.pagingConfig.currentPage}
    this.keepCondition()
    this.search(false)
  }

  onChecked(id: string) {
    if (this.checkedList.includes(id)) this.checkedList.splice(this.checkedList.indexOf(id), 1)
    else  {
      this.checkedList.push(id)
    }
        if (this.checkedList.length === 0) {
          this.allChecked = false;
        }
        else {
          this.allChecked = false;
        }
  }

  updateAllChecked(): void {
    if (this.allChecked) {
      this.checkedList.length = 0
      this.checkedList = [...this.playlistList.map(t => t.id)]
    } else {
      this.checkedList.length = 0
    }
  }

  onDelete() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05006).subscribe()
    this.deleteModal.show()
  }

  editPlaylist(id: string) {
    this.keepCondition()
    this.router.navigate(['managements/playlist/', id]);
  }

  onCreatedDateFromChange(result: Date): void {
    this.filterSource.registeredFrom = !result ? result : moment(result).utc().format(this.commonConfigs.MOMENT_FORMAT_YYYY_MM_DD_d)
  }

  onCreatedDateToChange(result: Date): void {
    this.filterSource.registeredTo = !result ? result : moment(result).utc().format(this.commonConfigs.MOMENT_FORMAT_YYYY_MM_DD_d)
  }

  searchPlaylist() {
    this.pagingConfig.currentPage = 1;// reset value default
    this.playlistList = [];
    this.search();
  }

  checkNullListData() {
    this.playlistService.getAllPlaylist().pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.loading = false
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availableElements = res.availableElements;
      this.playlistList = res.items;
      if (this.playlistList.length < 1) {
        this.commonService.removeHeaderLeftCorner();
        this.commonService.addHeaderLeftCorner({ message: 'TT_PLAYLIST_MANAGEMENT' })
        this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05014).subscribe()
        this.isNullList = true
      }
      else {
        this.commonService.removeHeaderLeftCorner();
        this.commonService.addHeaderLeftCorner({
          message: 'TT_PLAYLIST_MANAGEMENT',
          btnName: 'BT_ADD_NEW'
        });

      }
    });
  }

  keepCondition() {
    this.filterSource.playlistLabel = this.onSearchCondition?.playlistLabel
    this.filterSource.registeredFrom = this.onSearchCondition?.registeredFrom
    this.filterSource.registeredTo = this.onSearchCondition?.registeredTo
  }

  search(isChanged = true) {
    this.loading = true;
    let options = isChanged
    ? {
      ...this.filterSource,
      playlistLabel: this.filterSource.playlistLabel?.trim(),
      page: this.pagingConfig.currentPage,
      pageSize: this.pagingConfig.itemsPerPage,
    }
    : this.onSearchCondition;
    Object.keys(options).forEach((key) => {
      if (!options[key]) {
        delete options[key];
      }
    });
    this.onSearchCondition = options
    this.playlistService.getAllPlaylist(options).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.loading = false
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availableElements = res.availableElements;
      this.playlistList = res.items
      if (this.allChecked) {
        this.updateAllChecked()
      }
    });
  }

}
