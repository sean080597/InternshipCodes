import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCreationComponent } from './user-creation/user-creation.component';
import { UserComponent } from './user.component';

const routes: Routes = [
    {
      path: '',
      component: UserComponent,
    },
    {
      path: 'user-creation',
      component: UserCreationComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
