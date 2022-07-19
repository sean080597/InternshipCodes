import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClassManagementComponent } from './class-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ClassDetailAdminComponent } from './class-detail-admin/class-detail-admin.component';
import { AddClassComponent } from './add-class/add-class.component';
import { ClassManagementService } from '../class/service/class-management.service';

const routes: Routes = [
  {
    path: '',
    component: ClassManagementComponent,
  },
  {
    path: ':id',
    component: ClassDetailAdminComponent,
  },
];
@NgModule({
  declarations: [
    ClassManagementComponent,
    ClassDetailAdminComponent,
    AddClassComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ClassManagementService,
    DatePipe
  ]
})
export class ClassManagementModule { }
