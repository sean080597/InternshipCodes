import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { AccountService } from "@app/_services";
import { AutoLogoutService } from '@app/_services/auto-logout.service';
import { CommonService } from '@app/_services/common.service';
import { environment } from '@environments/environment';
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent implements OnInit {
  timeoutRemainingLogout: number

  constructor(
    private router: Router,
    private accountService: AccountService,
    private bsModalRef: BsModalRef,
    private commonService: CommonService,
    private autoLogoutService: AutoLogoutService,
  ) {
    this.timeoutRemainingLogout = (environment.timeConfig.autoLogout - environment.timeConfig.showDialog) * 1000
  }

  ngOnInit(): void {
    console.log('timeout logout => ', this.timeoutRemainingLogout)
    this.commonService.setScreenID(SCREEN_IDS.ADS15001)
    setTimeout(() => {
      if (this.autoLogoutService.isDialogOpening) {
        this.onLogout()
      }
    }, this.timeoutRemainingLogout);
  }

  onConfirm(): void {
    this.bsModalRef.content.onClose.next(true);
    this.bsModalRef.hide();
  }

  onLogout(): void {
    this.commonService.isCloseMenuSidebar.next(true)
    this.bsModalRef.content.onClose.next(false);
    this.bsModalRef.hide();
    this.accountService.logout();
    localStorage.removeItem('user');
    this.router.navigate(['account/login']);
  }
}
