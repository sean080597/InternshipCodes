import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountService } from "@app/_services";
import { COMMON_CONFIGS, HISTORY_ACTIONS, INPUT_CONFIGS } from "@app/_constants";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Account } from '@app/_models/account/account.model';
import { CustomValidators } from '@app/_helpers/custom-validators';
import { ToastService } from '@app/shared/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '@app/_services/common.service';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { OperationService } from '@app/_services/operation.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  inputConfigs = INPUT_CONFIGS
  form!: FormGroup;
  loading = false;
  passwordSetting = false;
  formErrors = null

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private bsModalRef: BsModalRef,
    private toast: ToastService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private operationService: OperationService,
  ) {
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS13001)
    this.form = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required, Validators.pattern(COMMON_CONFIGS.PASSWORD_REGEX)]],
        password: ['', [Validators.required, Validators.pattern(COMMON_CONFIGS.PASSWORD_REGEX)]],
        confirmPassword: ['', Validators.required]
      }, { validators: CustomValidators.comparePassword });
    this.form.valueChanges.subscribe(() => this.formErrors = null)
  }

  get f() {
    return this.form.controls;
  }

  close(): void {
    this.bsModalRef.content.onClose.next(true);
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
  changePassword() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }
    this.loading = true;
    const account = new Account(this.form.getRawValue(), false).convertToReqBody() as Account;
    delete account.password;
    this.accountService.changePassword(account as Account).subscribe({
      next: () => {
        this.toast.toastSuccess(this.translateService.instant('SCC_MSG_UPDATED_PASSWORD'));
        this.formErrors = null; // delete message error
        this.close();
      },
      error: error => {
        this.formErrors = error
        this.loading = false;
      }
    });
  }
}
