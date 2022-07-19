import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '@app/@core/helpers';
import { Role } from '@app/@core/models/role';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'question-bank',
        loadChildren: () =>
          import('./question-bank/question-bank.module').then(
            (m) => m.QuestionBankModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
      },
      {
        path: 'learning-activity',
        loadChildren: () =>
          import('./learning-activity/learning-activity.module').then(
            (m) => m.LearningActivityModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
      },
      {
        path: 'work-page',
        loadChildren: () =>
          import('./work-page/work-page.module').then(
            (m) => m.WorkPageModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Student, Role.Admin] }
      },
      {
        path: 'test-report',
        loadChildren: () =>
          import('./test-report/test-report.module').then(
            (m) => m.TestReportModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
      },
      {
        path: 'submission',
        loadChildren: () =>
          import('./submission/submission.module').then(
            (m) => m.SubmissionModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      },
      {
        path: 'class',
        loadChildren: () =>
          import('./class/class.module').then(
            (m) => m.ClassModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Teacher] }
      },
      {
        path: 'grade',
        loadChildren: () =>
          import('./grade/grade.module').then(
            (m) => m.GradeModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Student] }
      },
      {
        path: 'class-management',
        loadChildren: () =>
          import('./class-management/class-management.module').then(
            (m) => m.ClassManagementModule
          ),
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
