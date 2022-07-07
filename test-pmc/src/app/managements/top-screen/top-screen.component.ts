import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '@app/account/change-password/change-password.component';
import { FLOWS, HISTORY_ACTIONS, ROLES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { AccountService, AlertService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-top-screen',
  templateUrl: './top-screen.component.html',
  styleUrls: ['./top-screen.component.scss']
})
export class TopScreenComponent implements OnInit {
  roles = ROLES;
  public bsModalRef: BsModalRef;

  constructor(private router: Router,
    private commonService: CommonService,
    private modalService: BsModalService,
    private accountService: AccountService,
    private alertService: AlertService,
    private operationService: OperationService
    ) { }

  ngOnInit(): void {
    this.commonService.setCurrentFlow(FLOWS.TOPSCREEN)
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS02001).subscribe()
  }
  getUserRole(){
    return this.getAccountValue('role') ? this.getAccountValue('role')[0] : this.roles.ROLE_MERCHANT_MANAGER
  }
  getAccountValue(property: string) {
    return this.accountService.accountValue ? this.accountService.accountValue[property] : null
  }
  onRedirect(path: string[]){
    this.router.navigate(path)
  }
  changePassword() {
    this.bsModalRef = this.modalService.show(ChangePasswordComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose.subscribe(() =>  {
      console.log('close change password');
    })
  }

  serviceUsage() {
    this.alertService.serviceUsage()
  }
}
