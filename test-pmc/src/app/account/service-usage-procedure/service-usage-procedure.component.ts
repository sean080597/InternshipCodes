import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-service-usage-procedure',
  templateUrl: './service-usage-procedure.component.html',
  styleUrls: ['./service-usage-procedure.component.scss']
})
export class ServiceUsageProcedureComponent implements OnInit {
  termsOfUseAgreement = false;
  constructor(
    private router: Router,
    private commonService: CommonService,
    )
  {
    if(this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
    this.termsOfUseAgreement = this.router.getCurrentNavigation().extras.state['isAgree'] || false;
    }
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS98001)
    if (!this.termsOfUseAgreement) {
      this.router.navigate(['account/terms-of-use']);
    }
  }

  navigateTopScreen() {
    this.router.navigate(["/top-screen"]);
  }

}
