import { Component, Input, OnChanges } from '@angular/core';
import { ChangePasswordComponent } from '@app/account/change-password/change-password.component';
import { HISTORY_ACTIONS, ROLES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { AccountService } from '@app/_services';
import { OperationService } from '@app/_services/operation.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnChanges {
  @Input() dataRightSide: {isOpenRightSide: boolean};
  public bsModalRef: BsModalRef;
  public roles = ROLES;
  public isOpenRightSide: boolean;
  public companyId: string;
  public companyName: string;

  constructor(
    private operationService: OperationService,
    private modalService: BsModalService,
    private accountService: AccountService,
    ) { }
  ngOnChanges(): void {
    this.isOpenRightSide = this.dataRightSide.isOpenRightSide;
    this.companyId = localStorage.getItem(this.accountService.LC_COMPANY_ID);
    this.companyName = localStorage.getItem(this.accountService.LC_COMPANY_NAME);
  }

  logout() {
    this.closRightSidebar();
    this.accountService.logout();
  }
  openChangePasswordModal() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS13001).subscribe()
    this.bsModalRef = this.modalService.show(ChangePasswordComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose.subscribe(() =>  this.closRightSidebar())
  }
  getAccountValue(property: string) {
    return this.accountService.accountValue ? this.accountService.accountValue[property] : null
  }

  getUserRole(){
    return this.getAccountValue('role') ? this.getAccountValue('role')[0] : this.roles.ROLE_MERCHANT_MANAGER
  }
  closRightSidebar(): void {
    this.isOpenRightSide = false;
    $('.overlay').removeClass('active');
    document.getElementById('body').style.overflowY = 'scroll';
  }
}
