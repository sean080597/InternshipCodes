import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { AccountComponent } from './account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ServiceUsageProcedureComponent } from './service-usage-procedure/service-usage-procedure.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import {AdminAuthenticationComponent} from "./admin-authentication/admin-authentication.component";
import {PasswordSettingComponent} from "./password-setting/password-setting.component";
import { CopyrightConfirmComponent } from './copyright-confirm/copyright-confirm.component';
import { LoginOldComponent } from './login-old/login-old.component';

const routes: Routes = [
  {
      path: '', component: AccountComponent,
      children: [
        {
          path: 'login',
          component: LoginOldComponent,
        },
        {
          path: 'copyright',
          component: CopyrightConfirmComponent,
        },
        {
          path: 'register',
          component: RegisterComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'admin-authentication',
          component: AdminAuthenticationComponent,
        },
        {
          path: 'set-password',
          component: PasswordSettingComponent,
        },
        {
          path: 'reset-password',
          component: ResetPasswordComponent,
        },
        {
          path: 'forget-password',
          component: ForgetPasswordComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'terms-of-use',
          component: TermsOfUseComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'service-usage-procedure',
          component: ServiceUsageProcedureComponent,
          canActivate: [AuthGuard]
        },
      ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
