import { ToastService } from './../../shared/toast/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountService } from "@app/_services";
import { BsModalRef } from "ngx-bootstrap/modal";
import { TranslateService } from '@ngx-translate/core';
import { ModalObject } from '@app/shared/modal/modal.component';
import { INPUT_CONFIGS } from '@app/_constants';
import { Account } from '@app/_models/account/account.model';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  public inputConfigs = INPUT_CONFIGS
  public form!: FormGroup;
  public loading = false;
  public confirmModal: ModalObject;
  public isErrorOccurred = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private translateService: TranslateService,
    private toast: ToastService,
    private bsModalRef: BsModalRef,
  ) {
  }

  ngOnInit(): void {
    // this.commonService.setScreenID(SCREEN_IDS.ADS14001)
    this.initConfirmModal();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(this.inputConfigs.EMAIL_MAXLENGTH)]],
    });

  }

  close(): void {
    this.bsModalRef.hide();
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: FormGroup) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  submit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }
    this.loading = true;
    const acountBody = new Account(this.form.getRawValue(), false).convertToReqBody();
    this.accountService.forgetPassword(acountBody as Account).subscribe((resp) => {
      this.loading = false;
      this.isErrorOccurred = false;
      this.confirmModal.show();
      // this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS14002, SCREEN_IDS.ADS01001).subscribe()
    }, (error) => {
      this.isErrorOccurred = true;
      this.loading = false;
    })
  }

  initConfirmModal() {
    this.confirmModal = {
      class: 'modal-lg modal-dialog-centered',
      title: this.translateService.instant('TT_FORGOT_PASSWORD'),
      textConfirm: this.translateService.instant('BT_CONFIRM'),
      contentFloatLeft: false,
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      showBtnDemo: false,
      marginBottom: true,
      confirm: async () => {
        this.isErrorOccurred = false;
        this.confirmModal.hide();
        this.close();
      },
    };
  }

}
