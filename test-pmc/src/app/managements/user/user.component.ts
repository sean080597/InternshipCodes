import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { finalize, first, takeUntil } from 'rxjs/operators';

import { COMMON_CONFIGS, FLOWS, HISTORY_ACTIONS, ROLES, SORTING_OPTS, USER_AUTHORITIES, USER_STATUS } from '@app/_constants';
import { UserService } from "@app/_services/user.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { UserEditingConfirmComponent } from './user-editing-confirm/user-editing-confirm.component';
import { UserDeletingComponent } from './user-deleting/user-deleting.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CompanySelectionComponent } from "@app/managements/user/company-selection/company-selection.component";
import { CommonService } from '@app/_services/common.service';
import { Users } from '@app/_models/users';
import { FilterSource } from '@app/_models/common';
import { ToastService } from '@app/shared/toast/toast.service';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models/account/account.model';
import { OperationService } from '@app/_services/operation.service';
import { ModalObject } from '@app/shared/modal/modal.component';
import { UserCreationComponent } from './user-creation/user-creation.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  private unsubscribe = new Subject<void>();
  users: Users[] = [];
  bsModalRef: BsModalRef;
  authotiryOptions: { key: string; value: string }[];
  commonConfigs = COMMON_CONFIGS
  startPage = 1;
  endPage = 10;
  onSearchEmail = null;
  pagingConfig = {
    itemsPerPage: 120,
    currentPage: 1,
    availablePages: 0,
    availableElements: 1,
  };
  public sort = SORTING_OPTS.ASC
  public sortingOpts = SORTING_OPTS
  filterSettings = {
    displayPerPage: true,
    sortByEmail: true,
    countTotal: true
  };
  onAdmin = false;

  filterSource: FilterSource

  selectedCompany: {
    companyName: '',
    id: ''
  }
  allChecked = false;
  checkedList: string[] = []
  displayPerPage = this.pagingConfig.itemsPerPage;
  authority = 1;
  public isReloadPaging = false;
  loading: false;
  account: Account;
  selectCompanyWarning = false;
  deleteModal: ModalObject;
  resendModal: ModalObject;
  reqResendForm: any;
  onSearchCondition: any = {
    page: 1,
    pageSize: 120,
    emailAddress: '',
    authorities: '',
    sortBy: 'LAST_UPDATE_DATE_DESC',
  };

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private router: Router,
    private translateService: TranslateService,
    private commonService: CommonService,
    private toast: ToastService,
    private accountService: AccountService,
    private operationService: OperationService,
  ) {
    this.commonService.addHeaderLeftCorner({
      message: 'TOP_SCREEN.USER.TITLE',
      btnName: 'BT_ADD_NEW'
    });
    this.commonService.btnStrikeOut.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.createNewUser(this.account);
    });
    this.authotiryOptions = this.userService.AUTHORITY_LIST || [];
    this.filterSource = this.userService.filterSource;
    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngOnInit() {
    this.initDeleteModal();
    this.initResendModal();
    this.account = this.accountService.accountValue;
    if (this.account.role.some((item: string) => item.includes(ROLES.ROLE_SERVICE_ADMIN))){
      this.onAdmin = true;
      this.authotiryOptions  = [
        { key: "LB_AUTHORITY_CLASSIFICATION_0", value: ROLES.ROLE_ALL },
        { key: "LB_AUTHORITY_CLASSIFICATION_1", value: ROLES.ROLE_SERVICE_ADMIN },
        { key: 'LB_AUTHORITY_CLASSIFICATION_2', value: ROLES.ROLE_MERCHANT_MANAGER },
      ];
      if (this.filterSource.authorities === '' && this.filterSource.emailAddress === '' && this.filterSource.companyId === '') {
        this.filterSource.authorities = '';
        this.filterSource.emailAddress = '';
        this.filterSource.companyId = '';
      }
      else
        this.userService.getCompanyList().subscribe(res => { this.selectedCompany = res.items.filter(company => company.id === this.filterSource.companyId )[0]})
    }
    else{
      this.authotiryOptions  = [
        { key: 'LB_AUTHORITY_CLASSIFICATION_2', value: ROLES.ROLE_MERCHANT_MANAGER },
      ];
      if (this.filterSource.authorities === '' && this.filterSource.emailAddress === '' && this.filterSource.companyId === '') {
        this.filterSource.authorities = this.account.role[0];
        this.filterSource.emailAddress = '';
        this.userService.getCompanyList().subscribe(res => { this.selectedCompany = res.items.filter(company => company.id === this.account.companyId )[0]; this.filterSource.companyId = this.selectedCompany.id})
      }
      else
        this.userService.getCompanyList().subscribe(res => { this.selectedCompany = res.items.filter(company => company.id === this.filterSource.companyId )[0]})

    }
    this.commonService.setScreenID(SCREEN_IDS.ADS07001)
    this.search();
    this.commonService.setCurrentFlow(FLOWS.USER)
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.removeHeaderLeftCorner();
    this.commonService.setActionsBarTemplate(null)
  }

  keepCondition() {
    this.filterSource.emailAddress = this.onSearchCondition?.emailAddress
    this.filterSource.authorities = this.onSearchCondition?.authorities
  }

  sortChange(e) {
    this.filterSource.sortBy = e === this.sortingOpts.ASC ? this.sortingOpts.EMAIL_ASC : this.sortingOpts.EMAIL_DESC
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

  searchUser() {
    this.pagingConfig.currentPage = 1;// reset value default
    this.users = [];
    this.search();
  }

  search(isChanged: boolean = true) {
    let options = isChanged
    ? {
      ...this.filterSource,
      page: this.pagingConfig.currentPage,
      emailAddress: this.filterSource.emailAddress.trim(),
      pageSize: this.pagingConfig.itemsPerPage,
    }
    : this.onSearchCondition;

    this.onSearchCondition = options
    this.userService.getAllUser(
      options
    ).subscribe((res) => {
      this.users = res.items;
      this.pagingConfig.availableElements = res.availableElements;
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availablePages = res.availablePages;
      if (this.allChecked) {
        this.updateAllChecked()
      }
    });
  }

  initDeleteModal() {
    this.deleteModal = {
      class: 'modal-lg modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      marginBottom: true,
      ignoreBackdropClick: true,
      confirm: async () => {
        if(this.allChecked) {
          this.userService.deleteAllUsers(this.onSearchCondition)
          .subscribe(res => {
            this.commonService.setScreenID(SCREEN_IDS.ADS07001)
            this.toast.toastSuccess(this.translateService.instant('SCC_MSG_DELETED'))
            this.userService.getAllUser().subscribe((res) => {
              this.users = res.items;
              this.pagingConfig.availableElements = res.availableElements;
              this.pagingConfig.currentPage = res.page;
              this.pagingConfig.availablePages = res.availablePages;
            });
          })
          this.allChecked = false; this.checkedList.length = 0
          this.deleteModal.hide();
        }
        else {
          this.userService.deleteMultiUsers(this.checkedList).subscribe(res => {
            this.commonService.setScreenID(SCREEN_IDS.ADS07001)
            this.toast.toastSuccess(this.translateService.instant('SCC_MSG_DELETED'))
            this.search();this.checkedList.length = 0
          })
          this.deleteModal.hide();
        }
      },
      cancel: async () => {
        this.commonService.setScreenID(SCREEN_IDS.ADS07001)
        this.deleteModal.hide();
      },
    };
  }


  initResendModal() {
    this.resendModal = {
      class: 'modal-lg modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      marginBottom: true,
      ignoreBackdropClick: true,
      confirm: async () => {
      this.userService
      .resendEmail(this.reqResendForm)
      .pipe(first())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (res) => {
          this.search()
        },
        error: error => {
          this.toast.toastError(this.translateService.instant('ERR_MSG_USER_NOT_EXIST'))
          this.loading = false;
          this.search()
        }
      });
        this.resendModal.hide();
      },
      cancel: async () => {
        this.resendModal.hide();
      },
    };
  }

  onDelete() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07009).subscribe()
    this.deleteModal.show()
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
      this.checkedList = [...this.users.map(t => t.id)]
      this.checkedList.splice(this.checkedList.indexOf(this.account.userId), 1)
      // for (let p in this.playlistList) {
      //   this.checkedList.push(this.playlistList[p].id)
      // }
    } else {
      this.checkedList.length = 0
    }
  }

  createNewUser(user) {
    const userState = {user: user, isAdmin: this.onAdmin, company: this.selectedCompany}
    this.filterSource.emailAddress = this.onSearchEmail;
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07010).subscribe()
    const modal: BsModalRef = this.modalService.show(UserCreationComponent, {
      class: 'modal-xl modal-dialog-centered modal-dialog-scrollable mh-90',
      ignoreBackdropClick: true,
      initialState: userState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.commonService.setScreenID(SCREEN_IDS.ADS07001)
        this.search();
      })
    // this.router.navigate(['managements/user/user-creation'], { state: { onAdmin: this.onAdmin, companyId: this.account.companyId } });
  }

  statusMapping(status) {
    return this.translateService.instant(
      USER_STATUS.filter((stt) => stt.status === status).map(
        (item) => item.label
      ) + ''
    );
  }

  roleMapping(role) {
    return this.translateService.instant(
      USER_AUTHORITIES.filter((auth) => auth.role === role).map(
        (item) => item.label
      ) + ''
    );
  }


  openUserEditing(user) {
    const userState = {user: user, isAdmin: this.onAdmin, company: this.selectedCompany}
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07007).subscribe()
    // this.bsModalRef = this.modalService.show(UserEditingComponent, {
    //   initialState: user,
    //   class: 'modal-lg modal-dialog-centered',
    //   ignoreBackdropClick: true,
    // });
    // this.bsModalRef.content.onClose = new Subject<boolean>();
    const modal: BsModalRef = this.modalService.show(UserCreationComponent, {
      class: 'modal-xl modal-dialog-centered modal-dialog-scrollable',
      ignoreBackdropClick: true,
      initialState: userState
    })
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.commonService.setScreenID(SCREEN_IDS.ADS07001)
        this.search()
      });
  }

  openUserEditingConfirm(data) {
    this.bsModalRef = this.modalService.show(UserEditingConfirmComponent, {
      initialState: data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        if (res.key === 'returnEdit') {
          this.openUserEditing(data)
        }
        else {
          this.search();
        }
      })
  }

  openUserDeleting() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07009).subscribe()
    const modal: BsModalRef = this.modalService.show(UserDeletingComponent, {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => this.search());
  }

  resendEmail(user) {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07004).subscribe()
    this.reqResendForm = { email: user.emailAddress }
    this.resendModal.show();
  }

  selection(onSelectedCompany): void {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS96001).subscribe()
    this.bsModalRef = this.modalService.show(CompanySelectionComponent, {
      initialState: onSelectedCompany,
      class: 'modal-lg modal-dialog-centered modal-dialog-scrollable',
      ignoreBackdropClick: true,
    });
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.commonService.setScreenID(SCREEN_IDS.ADS07001)
      this.selectedCompany = res.selectedCompany;
      if (this.selectedCompany) {
        this.filterSource.companyId = res.selectedCompany.id; this.search()
      }
      else {
        this.filterSource.companyId = ''; this.search()
      }
    });
  }
}
