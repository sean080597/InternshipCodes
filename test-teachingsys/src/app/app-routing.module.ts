import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/@core/helpers';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/question-bank' },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.module').then(
        (m) => m.PagesModule
      ),
    // canActivate: [AuthGuard],
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./pages/error/error.module').then(
        (m) => m.ErrorModule
      ),
  },
  { path: 'grade', loadChildren: () => import('./pages/grade/grade.module').then(m => m.GradeModule) },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/error'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
