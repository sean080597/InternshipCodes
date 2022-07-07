import { Account } from './../../_models/account/account.model';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AccountService} from "@app/_services";
import { TranslateService } from '@ngx-translate/core';
import {finalize, first} from "rxjs/operators";
import { ModalObject } from '@app/shared/modal/modal.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-authentication',
  templateUrl: './admin-authentication.component.html',
  styleUrls: ['./admin-authentication.component.scss']
})
export class AdminAuthenticationComponent implements OnInit {
  private unsubscribe = new Subject<void>();
  public form!: FormGroup;
  public loading = false;
  public confirmModal: ModalObject;
  public serverRespErrors: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    // this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS10001).subscribe()
    this.form = this.formBuilder.group({
        userId: ['', Validators.required],
        password: ['', Validators.required],
        companyId: ['', Validators.required]
      });
    this.form.valueChanges.subscribe(() => this.serverRespErrors = null)

    this.initConfirmModal();
  }

  navigateLogin() {
    this.router.navigate(["account/login"]);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: FormGroup)=> {
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
     // convert data
    const body = new Account(this.form.getRawValue(), false).convertToReqBodyLoginSteraMarket();
    this.accountService.register(body as Account).pipe(first(), finalize(() => this.loading = false)).subscribe({
        next: () => {
          // this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS10002).subscribe()
          this.confirmModal.show();
          this.serverRespErrors = undefined;
        },
        error: error => {
          this.serverRespErrors = error.fieldErrors[0].message || undefined;
        }
      });
  }

  initConfirmModal() {
    this.confirmModal = {
      class: 'modal-md modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_CLOSE'),
      contentFloatLeft: false,
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      marginBottom: true,
      confirm: async () => {
        // this.submitted = false;
        this.confirmModal.hide();
        this.form.reset()
      },
    };
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
