import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentWorkpageComponent } from './student-workpage/student-workpage.component';
import { StudentGradeComponent } from './student-grade/student-grade.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { StudentWorkpageQuestionComponent } from './student-workpage/student-workpage-question/student-workpage-question.component';
import { StudentWorkpageViewFeedbackComponent } from './student-workpage/student-workpage-view-feedback/student-workpage-view-feedback.component';
import { StudentWorkpageSelfEvaluationComponent } from './student-workpage/student-workpage-self-evaluation/student-workpage-self-evaluation.component';
import { StudentWorkpageGiveFeedbackComponent } from './student-workpage/student-workpage-give-feedback/student-workpage-give-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: StudentWorkpageComponent,
  },
  {
    path: 'questions/:id',
    component: StudentWorkpageQuestionComponent,
  },
  {
    path: 'view-feedback/:id',
    component: StudentWorkpageViewFeedbackComponent,
  },
  {
    path: 'self-evaluation/:id',
    component: StudentWorkpageSelfEvaluationComponent,
  },
  {
    path: 'give-feedback/:id',
    component: StudentWorkpageGiveFeedbackComponent,
  },
  {
    path: 'grade',
    component: StudentGradeComponent,
  }
];

@NgModule({
  declarations: [
    StudentWorkpageComponent,
    StudentGradeComponent,
    StudentWorkpageQuestionComponent,
    StudentWorkpageViewFeedbackComponent,
    StudentWorkpageSelfEvaluationComponent,
    StudentWorkpageGiveFeedbackComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class WorkPageModule { }
