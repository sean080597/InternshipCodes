import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionComponent } from './submission.component';
import { PendingComponent } from './pending/pending.component';
import { ReviewComponent } from './pending/review/review.component';
import { CompletedComponent } from './completed/completed.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { ReviewCompletedComponent } from './completed/review-completed/review-completed.component';
import { ReviewFeedbackComponent } from './feedback/review-feedback/review-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: PendingComponent,
  },
  {
    path: 'pending',
    children: [
      {path: ':id', component: ReviewComponent},
      {path: '', component: PendingComponent},
    ]
  },
  {
    path: 'completed',
    children: [
      {path: ':id', component: ReviewCompletedComponent},
      {path: '', component: CompletedComponent},
    ]
  },
  {
    path: 'feedback',
    children: [
      {path: ':id', component: ReviewFeedbackComponent},
      {path: '', component: FeedbackComponent},
    ]
  }
];

@NgModule({
  declarations: [
    SubmissionComponent,
    PendingComponent,
    CompletedComponent,
    FeedbackComponent,
    ReviewComponent,
    ReviewCompletedComponent,
    ReviewFeedbackComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SubmissionModule { }
