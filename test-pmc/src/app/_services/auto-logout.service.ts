import { Location } from '@angular/common';
import { Injectable } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { LogoutModalComponent } from "@app/account/logout-modal/logout-modal.component";
import { Subject } from "rxjs";
import { AccountService } from "./account.service";
import { HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { OperationService } from './operation.service';
import { environment } from '@environments/environment';

const STORE_KEY = 'lastAction';
@Injectable({ providedIn: 'root' })
export class AutoLogoutService {
  timeoutDialog: number

  public modalRef: BsModalRef;
  isDialogOpening = false;
  interval: any
  timeoutTracker: any

  constructor(
    private location: Location,
    private modalService: BsModalService,
    private accountService: AccountService,
    private operationService: OperationService,
  ) {
    this.timeoutDialog = environment.timeConfig.showDialog * 1000
  }

  startCheckTimeout() {
    this.tracker()
    this.initIntervalDialog()
  }

  updateExpiredTime() {
    // timeoutTracker to delay 300ms before updateExpiredTime
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker)
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem(STORE_KEY, Date.now() + this.timeoutDialog + '')
    }, 200)
  }

  tracker() {
    window.addEventListener('click', () => this.updateExpiredTime());
    window.addEventListener('mouseover', () => this.updateExpiredTime());
    window.addEventListener('mouseout', () => this.updateExpiredTime());
    window.addEventListener('scroll', () => this.updateExpiredTime());
    window.addEventListener('keydown', () => this.updateExpiredTime());
    window.addEventListener('keyup', () => this.updateExpiredTime());
    window.addEventListener('keypress', () => this.updateExpiredTime());
  }

  initIntervalDialog() {
    this.updateExpiredTime()
    this.interval = setInterval(() => {
      if (!this.accountService.checkHideInfoTemp(this.location.path())) {
        const dialogTime = parseInt(localStorage.getItem(STORE_KEY) || 0 + '', 10)
        if (dialogTime < Date.now() && !this.isDialogOpening) {
          this.openConfirmDialog()
        }
      }
    }, 1000)
  }

  openConfirmDialog() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS15001).subscribe()
    this.isDialogOpening = true;
    this.modalRef = this.modalService.show(LogoutModalComponent, { class: 'modal-dialog-centered', ignoreBackdropClick: true });
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.subscribe((isConfirmed: boolean) => {
      this.isDialogOpening = false;
      if (isConfirmed) {
        this.startCheckTimeout()
      }
    })
  }
}
