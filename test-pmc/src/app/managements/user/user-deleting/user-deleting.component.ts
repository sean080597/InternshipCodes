import { Component, OnInit } from '@angular/core';
import { COMMON_CONFIGS, USER_AUTHORITIES, USER_STATUS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { AlertService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { UserService } from '@app/_services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-deleting',
  templateUrl: './user-deleting.component.html',
  styleUrls: ['./user-deleting.component.scss']
})
export class UserDeletingComponent implements OnInit {
  loading = false;
  submitted = false;
  userData
  commonConfigs = COMMON_CONFIGS

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private userService: UserService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private commonService: CommonService,
  ) {
    this.userData = this.modalService.config.initialState
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS07009)
  }

  statusMapping(status) {
    return this.translateService.instant(
      USER_STATUS.filter((stt) => stt.status === status).map(
        (item) => item.label
      ) + ''
    );
  }

  roleMapping(role) {
    return this.translateService.instant(
      USER_AUTHORITIES.filter((auth) => auth.role === role).map(
        (item) => item.label
      ) + ''
    );
  }

  close(): void {
    this.bsModalRef.content.onClose.next({ key: 'close', value: true });
    this.bsModalRef.hide();
  }

  onDelete() {
    this.submitted = true;
    this.loading = true;
    this.userService.submitUserDeleting(this.userData.id)
      .subscribe({
        next: (res) => {
          this.commonService.setScreenID(SCREEN_IDS.ADS07001)
          this.close()
        },
        error: error => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
