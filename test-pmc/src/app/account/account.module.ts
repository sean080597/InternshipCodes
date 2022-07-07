import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { LoginOldComponent } from './login-old/login-old.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from '@app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { ServiceUsageProcedureComponent } from './service-usage-procedure/service-usage-procedure.component';
import { AdminAuthenticationComponent } from './admin-authentication/admin-authentication.component';
import { PasswordSettingComponent } from './password-setting/password-setting.component';
import {TranslateModule} from "@ngx-translate/core";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TermsOfUseModalComponent } from './terms-of-use-modal/terms-of-use-modal.component';
import { LogoutModalComponent } from './logout-modal/logout-modal.component';
import {ModalModule} from "ngx-bootstrap/modal";
import { ServiceUsageModalComponent } from './service-usage-procedure/service-usage-modal/service-usage-modal.component';
import { LicenseModalComponent } from './license-modal/license-modal.component';
import { CopyrightConfirmComponent } from './copyright-confirm/copyright-confirm.component';
import { CompanyPermissionsComponent } from './company-permissions/company-permissions.component';


@NgModule({
  declarations: [
    LoginComponent,
    LoginOldComponent,
    RegisterComponent,
    AccountComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    TermsOfUseComponent,
    ServiceUsageProcedureComponent,
    AdminAuthenticationComponent,
    PasswordSettingComponent,
    ChangePasswordComponent,
    TermsOfUseModalComponent,
    LogoutModalComponent,
    ServiceUsageModalComponent,
    LicenseModalComponent,
    CopyrightConfirmComponent,
    CompanyPermissionsComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    AccountRoutingModule,
    TranslateModule,
    ModalModule.forRoot()
  ]
})
export class AccountModule { }
