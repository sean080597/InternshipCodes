import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBankComponent } from './question-bank.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LearningActivityFormComponent } from '../learning-activity/learning-activity-form/learning-activity-form.component';
import { ViewDetailsComponent } from '../learning-activity/view-details/view-details.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionBankComponent,
  },
  {
    path: 'edit/:id',
    component: LearningActivityFormComponent,
  },
  {
    path: 'view-details/:id',
    component: ViewDetailsComponent,
  }
];


@NgModule({
  declarations: [
    QuestionBankComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class QuestionBankModule { }
