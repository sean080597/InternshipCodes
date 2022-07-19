import { GroupDetailComponent } from './group-detail/group-detail.component';
import { ClassDetailComponent } from './class-detail/class-detail.component';
import { ClassListComponent } from './class-list/class-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ClassListComponent
  },
  {
    path: 'class-detail/:id',
    component: ClassDetailComponent
  },
  {
    path: 'group-detail/:id',
    component: GroupDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule { }
