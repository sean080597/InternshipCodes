import { SharedModule } from '@app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GradeRoutingModule } from './grade-routing.module';
import { GradeComponent } from './grade.component';
import { GradeListComponent } from './grade-list/grade-list.component';
import { GradeDetailComponent } from './grade-detail/grade-detail.component';
import { GradeDetailOverviewComponent } from './grade-detail/grade-detail-overview/grade-detail-overview.component';
import { GradeDetailAssessmentComponent } from './grade-detail/grade-detail-assessment/grade-detail-assessment.component';
import { GradeDetailAnswerComponent } from './grade-detail/grade-detail-answer/grade-detail-answer.component';
import { GradeDetailAssessmentCheckScoreComponent } from './grade-detail/grade-detail-assessment/grade-detail-assessment-check-score/grade-detail-assessment-check-score.component';
import { GradeDetailAssessmentVisualInspectionComponent } from './grade-detail/grade-detail-assessment/grade-detail-assessment-visual-inspection/grade-detail-assessment-visual-inspection.component';
import { GradeDetailAssessmentFunctionalChecksComponent } from './grade-detail/grade-detail-assessment/grade-detail-assessment-functional-checks/grade-detail-assessment-functional-checks.component';
import { GradeDetailAssessmentGradeComponent } from './grade-detail/grade-detail-assessment/grade-detail-assessment-grade/grade-detail-assessment-grade.component';
import { GradeDetailAnswerItemComponent } from './grade-detail/grade-detail-answer/grade-detail-answer-item/grade-detail-answer-item.component';


@NgModule({
  declarations: [
    GradeComponent,
    GradeListComponent,
    GradeDetailComponent,
    GradeDetailOverviewComponent,
    GradeDetailAssessmentComponent,
    GradeDetailAnswerComponent,
    GradeDetailAssessmentCheckScoreComponent,
    GradeDetailAssessmentVisualInspectionComponent,
    GradeDetailAssessmentFunctionalChecksComponent,
    GradeDetailAssessmentGradeComponent,
    GradeDetailAnswerItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GradeRoutingModule
  ]
})
export class GradeModule { }
