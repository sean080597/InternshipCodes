import { ClassListComponent } from './class-list/class-list.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ClassRoutingModule } from './class-routing.module';
import { ClassComponent } from './class.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClassManagementService } from './service/class-management.service';
import { ClassDetailComponent } from './class-detail/class-detail.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { StudentListComponent } from './student-list/student-list.component';
import { ClassCreationEditDialogComponent } from './class-list/class-creation-edit-dialog/class-creation-edit-dialog.component';
import { AddStudentGroupDialogComponent } from './class-detail/add-student-group-dialog/add-student-group-dialog.component';
import { MoveStudentGroupDialogComponent } from './group-detail/move-student-group-dialog/move-student-group-dialog.component';
import { RemoveStudentGroupDialogComponent } from './group-detail/remove-student-group-dialog/remove-student-group-dialog.component';
import { AddStudentToGroupComponent } from './group-detail/add-student-to-group/add-student-to-group.component';


@NgModule({
  declarations: [
    ClassComponent,
    ClassListComponent,
    ClassDetailComponent,
    GroupDetailComponent,
    StudentListComponent,
    ClassCreationEditDialogComponent,
    AddStudentGroupDialogComponent,
    MoveStudentGroupDialogComponent,
    RemoveStudentGroupDialogComponent,
    AddStudentToGroupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClassRoutingModule
  ],
  providers: [
    ClassManagementService,
    DatePipe
  ]
})
export class ClassModule { }
