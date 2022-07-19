import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LearningActivityComponent } from './learning-activity.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LearningActivityFormComponent } from './learning-activity-form/learning-activity-form.component';
import { GeneralInformationComponent } from './learning-activity-form/general-information/general-information.component';
import { AddQuestionsComponent } from './learning-activity-form/add-questions/add-questions.component';
import { PreviewComponent } from './learning-activity-form/preview/preview.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { SelectQuestionComponent } from './learning-activity-form/select-question/select-question.component';
import { SelectTaskDialogComponent } from './learning-activity-form/select-task-dialog/select-task-dialog.component';
import { AssignStudentComponent } from './assign-student/assign-student.component';
import { ClassManagementService } from '../class/service/class-management.service';


const routes: Routes = [
  {
    path: '',
    component: LearningActivityComponent,
  },
  {
    path: 'create',
    component: LearningActivityFormComponent,
  },
  {
    path: 'edit/:id',
    component: LearningActivityFormComponent,
  },
];

@NgModule({
  declarations: [
    LearningActivityComponent,
    LearningActivityFormComponent,
    GeneralInformationComponent,
    AddQuestionsComponent,
    PreviewComponent,
    ViewDetailsComponent,
    SelectQuestionComponent,
    SelectTaskDialogComponent,
    AssignStudentComponent,
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
export class LearningActivityModule { }
