import { Component, OnInit } from '@angular/core';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-resend-email',
  templateUrl: './user-resend-email.component.html',
  styleUrls: ['./user-resend-email.component.scss']
})
export class UserResendEmailComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef, private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS07004)
  }

  close(): void {
    this.bsModalRef.content.onClose.next(true);
    this.bsModalRef.hide();
  }

}
