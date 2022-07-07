import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { HISTORY_ACTIONS, ROLES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';


@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, OnChanges {
  @Input() dataLeftSide: {isOpenLeftSide: boolean, isHideInfoTemp: boolean};
  public roles = ROLES;
  public isOpenLeftSide: boolean;

  constructor(
    private router: Router,
    public commonService: CommonService,
    private accountService: AccountService,
    private operationService: OperationService) { }
  ngOnChanges(): void {
    this.isOpenLeftSide = this.dataLeftSide.isOpenLeftSide;
  }

  ngOnInit(): void {

  }

  getAccountValue(property: string) {
    return this.accountService.accountValue ? this.accountService.accountValue[property] : null
  }

  getUserRole(){
    return this.getAccountValue('role') ? this.getAccountValue('role')[0] : this.roles.ROLE_MERCHANT_MANAGER
  }
  billingInformationManagement() {
    this.redirectPath(['managements/billing-info']);
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

  redirectPath(path: string[]){
    this.closeLeftSidebar();
    this.router.navigate(path);
  }
  closeLeftSidebar(): void {
    this.isOpenLeftSide = false;
    $('.overlay').removeClass('active');
  }

}
