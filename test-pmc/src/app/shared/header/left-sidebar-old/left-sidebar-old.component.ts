import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AccountService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { HISTORY_ACTIONS, ROLES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { ChangePasswordComponent } from '@app/account/change-password/change-password.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-left-sidebar-old',
  templateUrl: './left-sidebar-old.component.html',
  styleUrls: ['./left-sidebar-old.component.scss']
})
export class LeftSidebarOldComponent implements OnInit, OnChanges {
  @Input() dataLeftSide: { isOpenLeftSide: boolean, isHideInfoTemp: boolean };
  @Output() isOpenLeftSideSync: EventEmitter<boolean> = new EventEmitter<boolean>();
  public roles = ROLES;
  public isOpenLeftSide: boolean;
  public bsModalRef: BsModalRef;
  public selectItem: string;
  public routerList = [
    "playlist",
    "distribution",
    "receipt",
    "image-gallery",
    "usage-record",
    "notica-management",
    "operation",
    "user",
    "top-screen"
  ]
  constructor(
    private router: Router,
    private modalService: BsModalService,
    public commonService: CommonService,
    private accountService: AccountService,
    private operationService: OperationService) {

  }
  ngOnChanges(): void {
    this.isOpenLeftSide = this.dataLeftSide.isOpenLeftSide;
    this.selectItem = window?.location?.pathname || '';
    this.routerList.forEach(item => {
      if (window?.location?.pathname.includes(item)) {
        this.selectItem = item;
      }
    })
  }

  ngOnInit(): void {

  }

  getAccountValue(property: string) {
    return this.accountService.accountValue ? this.accountService.accountValue[property] : null
  }

  getUserRole() {
    return this.getAccountValue('role') ? this.getAccountValue('role')[0] : this.roles.ROLE_MERCHANT_MANAGER
  }

  manageDistribution() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS06001).subscribe()
    this.redirectPath(["managements/distribution"]);
  }

  managePlaylist() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05001).subscribe();
    this.redirectPath(["managements/playlist"]);
  }

  manageReceipt() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04001).subscribe();
    this.redirectPath(["managements/receipt"]);
  }

  manageImageRegistered() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS03001).subscribe();
    this.redirectPath(["managements/image-gallery"]);
  }

  manageUsers() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07001).subscribe();
    this.redirectPath(["managements/user"]);
  }

  noticaManagement() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS09003).subscribe();
    this.redirectPath(["managements/notica-management"]);
  }

  usageRecord() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS08002).subscribe();
    this.redirectPath(["managements/usage-record"]);
  }
  operation() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS09002).subscribe();
    this.redirectPath(["managements/operation"]);
  }
  changePassword() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS13001).subscribe();
    this.bsModalRef = this.modalService.show(ChangePasswordComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose.subscribe(() => this.closeLeftSidebar());
  }

  redirectPath(path: string[]) {
    this.closeLeftSidebar();
    this.router.navigate(path);
  }
  closeLeftSidebar(): void {
    this.isOpenLeftSideSync.next(false);
    this.isOpenLeftSide = false;
    $('.overlay').removeClass('active');
    document.getElementById('body').style.overflowY = 'scroll';
  }

}
