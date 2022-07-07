import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HISTORY_ACTIONS, INPUT_CONFIGS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { UserService } from '@app/_services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})
export class UserEditingComponent implements OnInit {
  inputConfigs = INPUT_CONFIGS
  authotiryOptions: { key: string, value: string }[]
  editingForm: FormGroup
  submitted = false;
  isEmailExisted = false;
  userData
  ipDomainCheckFail: boolean;
  ipValidateFail: boolean = false;
  domainValidateFail: boolean = false;

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private operationService: OperationService,
  ) {
    this.userData = this.modalService.config.initialState
    this.authotiryOptions = this.userService.AUTHORITY_LIST || []
    this.editingForm = this.formBuilder.group({
      userCompanyId: [this.userData.companyName, [Validators.required]],
      userEmail: [this.userData.emailAddress, [Validators.required, Validators.email, Validators.maxLength(INPUT_CONFIGS.EMAIL_MAXLENGTH)]],
      userSelection: [this.userData.authorities, [Validators.required]],
      accessCheckFlag: [this.userData.accessCheckFlag],
      permissionType: [this.userData.permissionType],
      domain: [this.userData.domain],
      ipAddress: [this.userData.ipAddress],
    })
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS07007)
  }

  close(): void {
    this.bsModalRef.content.onClose.next({ key: 'close', value: true });
    this.bsModalRef.hide();
  }

  unlock(): void {
    this.userService.unlockUser(this.userData.id).subscribe({
      next: (res) => {
        this.close()
      },
      error: error => {

      }
    })
    this.bsModalRef.content.onClose.next({ key: 'updateSuccess', value: true });
    this.bsModalRef.hide();
  }

  validateIpDomain(){
    if (this.editingForm.value.accessCheckFlag === true) {
      if (this.editingForm.value.permissionType === 'IP_ADDRESS') {
        if(this.editingForm.value.ipAddress === '' || !this.editingForm.value.ipAddress) {
          this.ipDomainCheckFail = false
        }
        else this.ipDomainCheckFail = true
      }
      else {
        if(this.editingForm.value.domain === '' || !this.editingForm.value.domain) {
          this.ipDomainCheckFail = false
        }
        else this.ipDomainCheckFail = true
      }
    }
    else this.ipDomainCheckFail = true;
    // this.editingForm.controls['domain'].setValidators(Validators.required)
    // this.editingForm.controls['ipAddress'].setValidators(Validators.required)
    // this.editingForm.updateValueAndValidity();
    // console.log(this.editingForm);
  }

  gotoConfirmScreen() {
    const options = {
      emailAddress: this.editingForm.value.userEmail,
      authorities: [''] ,
      companyId: '',
      type: null,
      sortBy: 'EMAIL_DESC',
      registeredFrom: null,
      registeredTo: null,
      page: 1,
      pageSize: 10,
    }
    this.validateIpDomain();
    this.userService.getAllUser(options).subscribe(res => {
      this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS07008, SCREEN_IDS.ADS07007).subscribe()
      if (this.editingForm.valid && res.items.length < 1) {
        if (this.ipDomainCheckFail) {
          this.ipValidateFail = false
          this.domainValidateFail = false
          const tmp = this.editingForm.value.permissionType === 'IP_ADDRESS'
          ? { ...this.userData, emailAddress: this.f['userEmail']?.value, authorities: this.f['userSelection']?.value,
          accessCheckFlag: this.editingForm.value.accessCheckFlag,
          permissionType: this.editingForm.value.permissionType,
          ipAddress: this.editingForm.value.ipAddress,
          domain: this.editingForm.value.domain, }
          : { ...this.userData, emailAddress: this.f['userEmail']?.value, authorities: this.f['userSelection']?.value,
          accessCheckFlag: this.editingForm.value.accessCheckFlag,
          permissionType: this.editingForm.value.permissionType,
          ipAddress: this.editingForm.value.ipAddress,
          domain: this.editingForm.value.domain, }
          this.bsModalRef.content.onClose.next({ key: 'gotoConfirmScreen', value: tmp });
          this.bsModalRef.hide();
        }
        else {
          if (this.editingForm.value.permissionType === 'IP_ADDRESS') {
            this.ipValidateFail = true
          }
          else this.domainValidateFail = true
        }
      }
      else {
        if(this.ipDomainCheckFail) {
          if(res.items[0].emailAddress === this.userData.emailAddress) {
            const tmp = this.editingForm.value.permissionType === 'IP_ADDRESS'
            ? { ...this.userData, emailAddress: this.f['userEmail']?.value, authorities: this.f['userSelection']?.value,
            accessCheckFlag: this.editingForm.value.accessCheckFlag,
            permissionType: this.editingForm.value.permissionType,
            ipAddress: this.editingForm.value.ipAddress, }
            : { ...this.userData, emailAddress: this.f['userEmail']?.value, authorities: this.f['userSelection']?.value,
            accessCheckFlag: this.editingForm.value.accessCheckFlag,
            permissionType: this.editingForm.value.permissionType,
            domain: this.editingForm.value.domain, }
            this.bsModalRef.content.onClose.next({ key: 'gotoConfirmScreen', value: tmp });
            this.bsModalRef.hide();
          }
          else {
            this.commonService.validateAllFormFields(this.editingForm);
            this.isEmailExisted = true;
          }
        }
        else {
          if (this.editingForm.value.permissionType === 'IP_ADDRESS') {
            this.ipValidateFail = true
          }
          else this.domainValidateFail = true
        }
      }
    })

  }

  get f() { return this.editingForm.controls; }
}
