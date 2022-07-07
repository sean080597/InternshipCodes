import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/toast/toast.service';
import { HISTORY_ACTIONS, INPUT_CONFIGS, ROLES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CustomValidators } from '@app/_helpers/custom-validators';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { UserService } from '@app/_services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { first, Subject, takeUntil } from 'rxjs';
import { CompanySelectionComponent } from '../company-selection/company-selection.component';
import { UserCreationModalComponent } from '../user-creation-modal/user-creation-modal.component';

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss']
})
export class UserCreationComponent implements OnInit {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  inputConfigs = INPUT_CONFIGS
  private unsubscribe = new Subject<void>();

  authotiryOptions: { key: string, value: string }[]
  creationForm: FormGroup
  submitted = false;
  userCompanyId = '';
  reqForm
  loading = false;
  selectedCompany: {
    companyName: '',
    id: '',
  }
  onCompany: any
  isAdmin: any;
  onIpAddress: boolean = false;
  selectCompanyWarning = false;
  domainValidateFail: boolean = false;
  ipValidateFail: boolean = false;
  ipDomainCheck: boolean = true;
  data: any;
  reqData: { email: any; authorities: any[]; accessCheckFlag: any; permissionType: any; ipAddress: any; domain?: undefined; } | { email: any; authorities: any[]; accessCheckFlag: any; permissionType: any; domain: any; ipAddress?: undefined; };
  onEditForm: boolean = false;
  onConfirm: boolean = false;
  ipDomainError = '';
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private translateService: TranslateService,
    private toast: ToastService,
    private operationService: OperationService,
    private bsModalRef: BsModalRef
  ) {
    this.data = this.modalService.config.initialState['user'];
    this.isAdmin = this.modalService.config.initialState['isAdmin']
    this.onCompany = this.modalService.config.initialState['company']

    // if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
    //   this.isAdmin = this.router.getCurrentNavigation().extras.state['onAdmin'];
    //   this.userCompanyId = this.router.getCurrentNavigation().extras.state['companyId'];
    //   if (this.router.getCurrentNavigation().extras.state['company']) {
    //     this.selectedCompany = this.router.getCurrentNavigation().extras.state['company'];
    //   }
    //   else {
    //     this.selectedCompany = {
    //       companyName: '',
    //       id: '',
    //     }
    //   }
    // }

    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
    this.creationForm = this.data.id
      ? this.formBuilder.group({
        userEmail: [this.data.emailAddress, [Validators.required, Validators.maxLength(INPUT_CONFIGS.EMAIL_MAXLENGTH), Validators.email]],
        userSelection: [this.data.authorities, [Validators.required]],
        accessCheckFlag: [this.data.accessCheckFlag],
        permissionType: [this.data.permissionType],
        domain: [this.data.domain],
        ipAddress: [this.data.ipAddress],
      }, { validators: CustomValidators.compareEmail })
      : this.formBuilder.group({
        userEmail: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.EMAIL_MAXLENGTH), Validators.email]],
        userEmailReenter: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.EMAIL_MAXLENGTH), Validators.email]],
        userSelection: ['', [Validators.required]],
        accessCheckFlag: [false],
        permissionType: ['DOMAIN'],
        domain: [''],
        ipAddress: [''],
      }, { validators: CustomValidators.compareEmail })

  }

  ngOnInit(): void {
    // this.f['userSelection'].touched
    this.authotiryOptions = this.isAdmin === true ? this.userService.AUTHORITY_LIST : [
      { key: 'LB_AUTHORITY_CLASSIFICATION_2', value: ROLES.ROLE_MERCHANT_MANAGER },
    ]
    this.commonService.setScreenID(SCREEN_IDS.ADS07010)
    this.commonService.setActionsBarOnTop(true)
    if (this.data.id) {
      this.creationForm.valueChanges.subscribe(
        result => {
          this.onEditForm = true;
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.setActionsBarTemplate(null)
    this.commonService.setActionsBarOnTop(false)

  }

  get f() { return this.creationForm.controls; }

  getAuthority() {
    return  this.authotiryOptions.filter(role => role.value === this.creationForm.value.userSelection)[0]?.key
  }

  checkRoleSelection() {
    {
      setTimeout(() => {
        return this.f['userSelection'].touched && this.f['userSelection'].invalid
      }, 30);
    }
  }

  resetError() {
    this.ipDomainError = '';
    this.domainValidateFail = false;
    this.ipDomainCheck = false;
  }

  onSave() {
    if (!this.onConfirm) {
      if (this.creationForm.value.accessCheckFlag === true) {
        this.validateIpDomain();
      }
      else this.ipDomainCheck = true;
      if (this.creationForm.invalid) {
        this.commonService.validateAllFormFields(this.creationForm)
        this.loading = true;
      }
      if (!this.selectedCompany?.id) {
        this.selectCompanyWarning = true
      }
      let checkReenterEmail = false;
      if (this.data.id) {
        checkReenterEmail = true
      }
      else if (this.creationForm.value.userEmail === this.creationForm.value.userEmailReenter) {
        checkReenterEmail = true
      }

      if (this.creationForm.valid && this.ipDomainCheck && (this.selectedCompany?.id || this.data?.companyName)) {
        this.ipValidateFail = false
        this.domainValidateFail = false
        this.onConfirm = true;
        this.resetError();
        this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, this.data.id ? SCREEN_IDS.ADS07008 : SCREEN_IDS.ADS07011).subscribe()
      }
      else {
        if (this.creationForm.value.permissionType === 'IP_ADDRESS') {
          this.ipValidateFail = true
        }
        else this.domainValidateFail = true
      }
    }
    else {
      this.ipValidateFail = false
      this.domainValidateFail = false
      if (this.creationForm.value.permissionType === 'IP_ADDRESS') {
        this.reqForm = this.isAdmin ? { email: this.creationForm.value.userEmail,
                        authorities: [this.creationForm.value.userSelection],
                        companyId: this.selectedCompany?.id ? this.selectedCompany.id : this.userCompanyId,
                        accessCheckFlag: this.checkAccessFlag(this.creationForm.value.accessCheckFlag),
                        permissionType: this.creationForm.value.permissionType,
                        ipAddress: this.creationForm.value.ipAddress,
                        }
                        :
                        { email: this.creationForm.value.userEmail,
                          authorities: [this.creationForm.value.userSelection],
                          companyId: this.userCompanyId,
                          accessCheckFlag: this.checkAccessFlag(this.creationForm.value.accessCheckFlag),
                          permissionType: this.creationForm.value.permissionType,
                          ipAddress: this.creationForm.value.ipAddress,
                          }
      }
      else {
        this.reqForm = this.isAdmin
          ? { email: this.creationForm.value.userEmail,
              authorities: [this.creationForm.value.userSelection],
              companyId: this.selectedCompany?.id ? this.selectedCompany.id : this.userCompanyId,
              accessCheckFlag: this.checkAccessFlag(this.creationForm.value.accessCheckFlag),
              permissionType: this.creationForm.value.permissionType,
              domain: this.creationForm.value.domain }
          : { email: this.creationForm.value.userEmail,
              authorities: [this.creationForm.value.userSelection],
              companyId: this.userCompanyId,
              accessCheckFlag: this.checkAccessFlag(this.creationForm.value.accessCheckFlag),
              permissionType: this.creationForm.value.permissionType,
              domain: this.creationForm.value.domain }
      }
      if (!this.data.id) {
        this.userService.submitUserCreation(this.reqForm)
        .pipe(first())
        .pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (res) => {
            this.bsModalRef.hide();
            this.bsModalRef.content.onClose.next(true);
            this.toast.toastSuccess(
              this.translateService.instant('TT_USER_CREATION_SUCCESS'),
              this.translateService.instant('TT_USER_CREATION_SUCCESS_DESC'),
              )
          },
          error: error => {
            if(error.fieldErrors[0].code === 'ERR_006' || error.fieldErrors[0].code === 'ERR_024') {
              const errList = []
              for (let e in error.fieldErrors) {
                errList.push(error.fieldErrors[e].message)
              }
              this.ipDomainError = errList.join('\r\n')
              this.loading = false;
            }
            else {
              this.toast.toastError(error.fieldErrors[0].message)
            }
          }
        });
      }
      else {
        this.userService.submitUserEditing(this.data.id, this.reqData = this.creationForm.value.permissionType === 'IP_ADDRESS'
            ? { email: this.creationForm.value.userEmail,
                authorities: [this.creationForm.value.userSelection],
                accessCheckFlag: this.checkAccessFlag(this.creationForm.value.accessCheckFlag),
                permissionType: this.creationForm.value.permissionType,
                ipAddress: this.creationForm.value.ipAddress,
          }
            : { email: this.creationForm.value.userEmail,
                authorities: [this.creationForm.value.userSelection],
                accessCheckFlag: this.checkAccessFlag(this.creationForm.value.accessCheckFlag),
                permissionType: this.creationForm.value.permissionType,
                domain: this.creationForm.value.domain, })
          .pipe(first())
          .subscribe({
            next: (res) => {
              this.bsModalRef.hide();
              this.bsModalRef.content.onClose.next(true);
              this.commonService.setScreenID(SCREEN_IDS.ADS07001)
            },
            error: error => {
              if(error.fieldErrors[0].code === 'ERR_006' || error.fieldErrors[0].code === 'ERR_024') {
                const errList = []
                for (let e in error.fieldErrors) {
                  errList.push(error.fieldErrors[e].message)
                }
                this.ipDomainError = errList.join('\r\n')
                this.loading = false;
              }
              else {
                this.toast.toastError(error.fieldErrors[0].message)
              }
              // if (error.fieldErrors.message === 'ユーザが存在していません。'){
              //   this.toast.toastError(error.fieldErrors.message)
              // }
              // else {
              //   this.toast.toastError(this.translateService.instant('ERR_MSG_USER_EMAIL_EXISTED'))
              //     this.loading = false;
              // }
            }
          });
      }
    }
  }

  checkAccessFlag(flag) {
    if (flag === false) {
      this.creationForm.get('permissionType').patchValue('DOMAIN')
      this.creationForm.get('ipAddress').patchValue('')
      this.creationForm.get('domain').patchValue('')
    }
    return flag
  }

  onBack() {
    this.router.navigate(['/managements/user']);
  }

  selection(onSelectedCompany): void {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS96001, SCREEN_IDS.ADS07010).subscribe()
    const modal: BsModalRef = this.modalService.show(CompanySelectionComponent, {
      initialState: onSelectedCompany,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modal.content.onClose = new Subject<boolean>();
    modal.content.onClose.pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.selectedCompany = res.selectedCompany;
    });
  }

  // notifySendMail() {
  //   this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07006).subscribe()
  //   const modal: BsModalRef  = this.modalService.show(UserCreationModalComponent, { class: 'modal-md modal-dialog-centered', ignoreBackdropClick: true });
  //   modal.content.onClose = new Subject<boolean>();
  //   modal.content.onClose.subscribe(() => this.commonService.setScreenID(SCREEN_IDS.ADS07001))
  // }

  validateIpDomain(){
    if (this.creationForm.value.accessCheckFlag === true) {
      if (this.creationForm.value.permissionType === 'IP_ADDRESS') {
        if(this.creationForm.value.ipAddress === '' || !this.creationForm.value.ipAddress) {
          this.ipDomainCheck = false
        }
        else this.ipDomainCheck = true
      }
      else {
        if(this.creationForm.value.domain === '' || !this.creationForm.value.domain) {
          this.ipDomainCheck = false
        }
        else this.ipDomainCheck = true
      }
    }
    else this.ipDomainCheck = true;
    // this.creationForm.controls['domain'].setValidators(Validators.required)
    // this.creationForm.controls['ipAddress'].setValidators(Validators.required)
    // this.creationForm.updateValueAndValidity();
  }
  validateIp() {
    if(this.creationForm.value.ipAddress === ''){
      this.ipValidateFail = true;
    }
    else this.ipValidateFail = false
    // this.creationForm.controls['ipAddress'].setValidators(Validators.required)
    // this.creationForm.updateValueAndValidity();
  }
  validateDomain() {
    if(this.creationForm.value.domain === ''){
      this.domainValidateFail = true;
    }
    else this.domainValidateFail = false
    // this.creationForm.controls['domain'].setValidators(Validators.required)
    // this.creationForm.updateValueAndValidity();
  }

  close(): void {
    if (!this.onConfirm) {
      this.bsModalRef.hide();
    }
    else {
      this.onConfirm = false;
      this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, this.data.id ? SCREEN_IDS.ADS07007 : SCREEN_IDS.ADS07010).subscribe()
    }
  }

}
