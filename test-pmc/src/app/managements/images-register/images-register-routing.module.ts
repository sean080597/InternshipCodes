import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { ImagesRegisterListComponent } from './images-register-list/images-register-list.component';
import { NewRegistrationComponent } from './new-registration/new-registration.component';

const routes: Routes = [

  {
    path: '',
    component: ImagesRegisterListComponent,
  },
  {
    path: 'details/:id',
    component: ImageDetailsComponent
  },
  {
    path: 'image-new-registration',
    component: NewRegistrationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagesRegisterRoutingModule { }
