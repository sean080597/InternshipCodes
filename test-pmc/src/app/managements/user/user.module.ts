import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { UserComponent } from './user.component';
import { CompanySelectionComponent } from './company-selection/company-selection.component';
import { SpecifyFilterComponent } from './specify-filter/specify-filter.component';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { UserDeletingComponent } from './user-deleting/user-deleting.component';
import { UserEditingConfirmComponent } from './user-editing-confirm/user-editing-confirm.component';
import { UserResendEmailComponent } from './user-resend-email/user-resend-email.component';
import { UserEditingComponent } from './user-editing/user-editing.component';
import { UserCreationModalComponent } from './user-creation-modal/user-creation-modal.component';


@NgModule({
  declarations: [
    UserComponent,
    CompanySelectionComponent,
    SpecifyFilterComponent,
    UserCreationComponent,
    UserDeletingComponent,
    UserEditingConfirmComponent,
    UserResendEmailComponent,
    UserEditingComponent,
    UserCreationModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
