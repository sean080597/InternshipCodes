import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRegisterRoutingModule } from './images-register-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NewRegistrationComponent } from './new-registration/new-registration.component';
import { DisplayDestinationModalComponent } from './display-destination-modal/display-destination-modal.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { NewRegistrationModalComponent } from './new-registration-modal/new-registration-modal.component';
import { ImageSelectModalComponent } from './image-select-modal/image-select-modal.component';
import { ImagesRegisterListComponent } from './images-register-list/images-register-list.component';
import { ImagesRegisterListModalComponent } from './images-register-list-modal/images-register-list-modal.component';
import { ImageDetailsModalComponent } from './image-details-modal/image-details-modal.component';


@NgModule({
  declarations: [
    DisplayDestinationModalComponent,
    NewRegistrationComponent,
    ImageDetailsComponent,
    NewRegistrationModalComponent,
    ImageSelectModalComponent,
    ImagesRegisterListComponent,
    ImagesRegisterListModalComponent,
    ImageDetailsModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ImagesRegisterRoutingModule
  ],
  exports: [
    NewRegistrationModalComponent,
    NewRegistrationComponent,
    ImagesRegisterListComponent,
    ImagesRegisterListModalComponent
  ]
})
export class ImagesRegisterModule { }
