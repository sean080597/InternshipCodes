import { Component, OnInit } from '@angular/core';
import { ToastService } from '@app/shared/toast/toast.service';
import { USER_AUTHORITIES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { AlertService } from '@app/_services';
import { CommonService } from '@app/_services/common.service';
import { UserService } from '@app/_services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { first } from 'rxjs';

@Component({
  selector: 'app-user-editing-confirm',
  templateUrl: './user-editing-confirm.component.html',
  styleUrls: ['./user-editing-confirm.component.scss']
})
export class UserEditingConfirmComponent implements OnInit {
  loading = false;
  submitted = false;
  userData;
  reqData;

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private userService: UserService,
    private alertService: AlertService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private toast: ToastService,
  ) { }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS07008)
    this.userData = this.modalService.config.initialState;
  }

  roleMapping(role) {
    return this.translateService.instant(
      USER_AUTHORITIES.filter((auth) => auth.role === role).map(
        (item) => item.label
      ) + ''
    );
  }

  back(): void {
    this.bsModalRef.content.onClose.next({ key: 'returnEdit'});
    this.bsModalRef.hide();
  }

  close(): void {
    this.bsModalRef.content.onClose.next('close');
    this.bsModalRef.hide();
  }

  onSave() {
    this.userService.submitUserEditing(this.userData.id, this.reqData = this.userData.permissionType === 'IP_ADDRESS' ? { email: this.userData.emailAddress, authorities: [this.userData.authorities], accessCheckFlag: this.userData.accessCheckFlag,
      permissionType: this.userData.permissionType,
      ipAddress: this.userData.ipAddress,
       } : { email: this.userData.emailAddress, authorities: [this.userData.authorities], accessCheckFlag: this.userData.accessCheckFlag,
        permissionType: this.userData.permissionType,
        domain: this.userData.domain, })
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.commonService.setScreenID(SCREEN_IDS.ADS07001)
          this.close()
        },
        error: error => {
          const errList = []
          for (let e in error.fieldErrors) {
            errList.push(error.fieldErrors[e].message)
          }
          const errStr = errList.join('\r\n')
          this.toast.toastError(this.translateService.instant(errStr))
          this.loading = false;
          if (error.fieldErrors.message === 'ユーザが存在していません。'){
            this.toast.toastError(error.fieldErrors.message)
          }
          else {
            this.toast.toastError(this.translateService.instant('ERR_MSG_USER_EMAIL_EXISTED'))
              this.loading = false;
          }
        }
      });
  }
}
