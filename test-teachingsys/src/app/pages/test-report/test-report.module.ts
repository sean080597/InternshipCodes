import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestReportComponent } from './test-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { TestReportDetailsComponent } from './test-report-details/test-report-details.component';
import { BestStudentsChartComponent } from './test-report-details/best-students-chart/best-students-chart.component';
import { QuestionChartComponent } from './test-report-details/question-chart/question-chart.component';
import { StatusStudentTabsComponent } from './test-report-details/status-student-tabs/status-student-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TestReportComponent,
  },
  {
    path: 'details/:id',
    component: TestReportDetailsComponent,
  }
];

@NgModule({
  declarations: [
    TestReportComponent,
    TestReportDetailsComponent,
    BestStudentsChartComponent,
    QuestionChartComponent,
    StatusStudentTabsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class TestReportModule { }
