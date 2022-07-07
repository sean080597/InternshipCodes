import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalObject } from '@app/shared/modal/modal.component';
import { ToastService } from '@app/shared/toast/toast.service';
import { COMMON_CONFIGS, INPUT_CONFIGS } from '@app/_constants';
import { CustomValidators } from '@app/_helpers/custom-validators';
import { AccountPasswordSetting } from '@app/_models/account/account.model';
import { AccountService } from "@app/_services";
import { CommonService } from '@app/_services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, first, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-password-setting',
  templateUrl: './password-setting.component.html',
  styleUrls: ['./password-setting.component.scss']
})
export class PasswordSettingComponent implements OnInit {
  inputConfigs = INPUT_CONFIGS
  private unsubscribe = new Subject<void>();
  form!: FormGroup;
  loading = false;
  confirmModal: ModalObject;
  formErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private toast: ToastService,
  ) {
    this.form = this.formBuilder.group({
      userId: ['', Validators.required],
      activationKey: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(COMMON_CONFIGS.PASSWORD_REGEX)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [CustomValidators.comparePassword] })
    this.form.valueChanges.subscribe(() => this.formErrors = null)
  }

  ngOnInit(): void {
    // this.commonService.setScreenID(SCREEN_IDS.ADS11001)
    this.initConfirmModal();
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      this.form.patchValue({ ...params })
    })
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: AccountPasswordSetting = {
        userId: this.form.value.userId,
        activationKey: this.form.value.activationKey,
        password: this.form.value.password
      }
      this.accountService.setPassword(data)
        .pipe(first(), finalize(() => this.loading = false))
        .subscribe({
          next: (res) => {
            // this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS11002, SCREEN_IDS.ADS11001).subscribe()
            this.confirmModal.show()
            this.formErrors = null; // delete message error
          },
          error: error => {
            this.formErrors = error
          }
        });
    } else {
      this.commonService.validateAllFormFields(this.form)
    }
  }

  initConfirmModal() {
    this.confirmModal = {
      class: 'modal-md modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_TO_LOGIN_SCREEN'),
      contentFloatLeft: false,
      hideFooter: false,
      verticalAlign: true,
      ignoreBackdropClick: true,
      hideCloseIcon: true,
      showBtnDemo: false,
      marginBottom: true,
      confirm: async () => {
        this.confirmModal.hide();
        this.router.navigate(["account/login"]);
      },
    };
  }
}
