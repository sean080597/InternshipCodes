import { GradeListComponent } from './grade-list/grade-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradeComponent } from './grade.component';
import { GradeDetailComponent } from './grade-detail/grade-detail.component';

const routes: Routes = [
  {
    path: '',
    component: GradeComponent,
    children: [
      {
        path: '',
        component: GradeListComponent
      },
      {
        path: 'grade-detail',
        component: GradeDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeRoutingModule { }
