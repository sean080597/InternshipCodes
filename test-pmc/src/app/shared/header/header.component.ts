import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { NotifyService } from '@app/account/notification';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() getBellsNumber = 0;
  public isHideInfoTemp = false;

  public isOpenLeftSide = false;
  public isOpenRightSide = false;
  public enableAccountAndNotify  = false;
  public bellsNumber = 0;

  constructor(
    private location: Location,
    private accountService: AccountService,
    private router: Router,
    private notifyService: NotifyService,
    public commonService: CommonService,

  ) {
    this.router.events.subscribe(() => {
      if (this.location.path() != "") {
        this.isHideInfoTemp = this.accountService.checkHideInfoTemp(this.location.path());
        this.enableAccountAndNotify = this.location.path().includes('copyright');
      }
    })
  }
  ngOnChanges(): void {
   this.bellsNumber = this.getBellsNumber;
  }

  ngOnInit(): void {
    this.commonService.isOpenMenuSidebar.subscribe((isOpenMenuSidebar: boolean) => {
      this.toggleNav(isOpenMenuSidebar ? 'left' : 'right')
    })
    this.commonService.isCloseMenuSidebar.subscribe((isCloseMenuSidebar: boolean) => {
      if (isCloseMenuSidebar) {
        this.closeBothSidebar();
      }
    })
  }

  notification(id: string) {
    this.notifyService.stroke(id).then((bellsNumber) => {
      if (bellsNumber &&  bellsNumber !== this.bellsNumber) {
         this.bellsNumber = bellsNumber;
      }
    });
    this.closeBothSidebar();
  }


  toggleNav(pos): void {
    if (pos === 'left') {
      this.isOpenLeftSide = !this.isOpenLeftSide;
      this.isOpenRightSide = false;
    } else if (pos === 'right') {
      this.isOpenRightSide = !this.isOpenRightSide;
      this.isOpenLeftSide = false;
    }
    this.toggleOverlay();
  }

  toggleOverlay(){
    if (this.isOpenLeftSide || this.isOpenRightSide) {
      $('.overlay').addClass('active');
      document.getElementById('body').style.overflowY = 'hidden';
      if (this.notifyService.isShowed()) {
        this.notifyService.stroke('id-notify').then((bellsNumber) => {
          if (bellsNumber &&  bellsNumber !== this.bellsNumber) {
             this.bellsNumber = bellsNumber;
          }
        });
      }
    } else {
      $('.overlay').removeClass('active');
      document.getElementById('body').style.overflowY = 'scroll';
    }
  }

  closeBothSidebar(): void {
    this.isOpenLeftSide = false;
    this.isOpenRightSide = false;
    $('.overlay').removeClass('active');
    document.getElementById('body').style.overflowY = 'scroll';
  }

}
