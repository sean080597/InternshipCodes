import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { environment } from '@environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public bsModalRef: BsModalRef;
  public isHideInfoTemp = false;
  public inquiryExternalUrl: string = environment.inquiryExternalUrl;

  constructor(
    private location: Location,
    private accountService: AccountService,
    private router: Router,
    private alertService: AlertService,
    public commonService: CommonService,
  ) {
    this.router.events.subscribe(() => {
      if (this.location.path() !== "") {
        this.isHideInfoTemp = this.accountService.checkHideInfoTemp(this.location.path())
      }
    })
  }

  ngOnInit(): void {

  }

  termsOfUseModal() {
    this.alertService.termsOfUseModal()
  }

  serviceUsage() {
    this.alertService.serviceUsage()
  }

  license() {
    this.alertService.license()
  }
  inquiry() {
    window.open(this.inquiryExternalUrl, "_blank");
  }

}
