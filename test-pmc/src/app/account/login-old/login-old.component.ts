import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService, AlertService } from '@app/_services';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Account } from '@app/_models/account/account.model';
import { CommonService } from '@app/_services/common.service';
import { HISTORY_ACTIONS, INPUT_CONFIGS } from '@app/_constants';
import { OperationService } from '@app/_services/operation.service';
import { SCREEN_IDS } from '@app/_constants/screen-id';
@Component({
  selector: 'app-login-old',
  templateUrl: './login-old.component.html',
  styleUrls: ['./login-old.component.scss'],
})
export class LoginOldComponent implements OnInit {
  inputConfigs = INPUT_CONFIGS
  public form: FormGroup;
  public loading = false;
  public isUserInvalid = false;
  public bsModalRef: BsModalRef;
  public isLocked = false;
  error = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private modalService: BsModalService,
    public commonService: CommonService,
    private operationService: OperationService
  ) { }

  ngOnInit() {
    this.commonService.setScreenID(SCREEN_IDS.ADS01001)
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(this.inputConfigs.EMAIL_MAXLENGTH)]],
      password: ['', [Validators.required, Validators.maxLength(this.inputConfigs.PASSWORD_MAXLENGTH)]],
    });
    this.form.valueChanges.subscribe(() => {
      this.error = ''
      this.isUserInvalid = false
      this.isLocked = false
    })
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: FormGroup) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }
    this.loading = true;
    this.alertService.clear();
    const acountBody = new Account(this.form.getRawValue(), false).convertToReqBodyLogin();
    this.accountService.login(acountBody as Account).subscribe((account: Account) => {
      this.commonService.setScreenID(SCREEN_IDS.ADS02001)
      this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.LOGIN, SCREEN_IDS.ADS01001).subscribe()

      if (!this.accountService.checkExistingAgreedUser()) {
        this.router.navigate(['/account/copyright']);
      } else {
        // this.commonService.isOpenMenuSidebar.next(true);
        this.accountService.handleCompanyPermissionModal()
        this.router.navigate(['/managements/top-screen']);
      }
    }, (error) => {
      if (error.fieldErrors.message) {
        this.error = error.fieldErrors.objectName
      }
      this.loading = false;
    })

  }

  forgotPassword() {
    // this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS14001, SCREEN_IDS.ADS01001).subscribe()
    this.bsModalRef = this.modalService.show(ForgetPasswordComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
