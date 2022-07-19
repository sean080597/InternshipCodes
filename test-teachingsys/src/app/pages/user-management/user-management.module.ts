import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { StudentListComponent } from './student-list/student-list.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
  }
];

@NgModule({
  declarations: [
    UserManagementComponent,
    StudentListComponent,
    AdminListComponent,
    TeacherListComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class UserManagementModule { }
