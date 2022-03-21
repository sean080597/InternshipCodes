import { FirstTimeAccessComponent } from './first-time-access/first-time-access.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavouriteComponent } from './favourite/favourite.component';
import { LoginComponent } from './core/login/login.component';
import { LogoutComponent } from './core/logout/logout.component';
import { Page404Component } from './page404/page404.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'favorite',
    component: FavouriteComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./favourite/favorite/favorite.module').then((m) => m.FavoriteModule),
      },
    ],
  },
  {
    path: 'container',
    component: FavouriteComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./container/container.module').then((m) => m.ContainerModule),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'shipment',
    component: FavouriteComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./shipment/shipment.module').then((m) => m.ShipmentModule),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'material',
    canActivate: [AuthGuard],
    component: FavouriteComponent,
    loadChildren: () => import('./material/material.module').then((m) => m.MaterialModule),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'admin',
    component: FavouriteComponent,
    // canActivate: [AuthGuard],
    children: [{ path: '', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule), runGuardsAndResolvers: 'always' }],
  },
  {
    path: 'data-export',
    canActivate: [AuthGuard],
    component: FavouriteComponent,
    children: [{ path: '', loadChildren: () => import('./export/export.module').then((m) => m.ExportModule) }],
  },
  {
    path: 'truck',
    component: FavouriteComponent,
    children: [{ path: '', loadChildren: () => import('./truck/truck.module').then((m) => m.TruckModule) }],
  },
  {
    path: 'data-downloading',
    component: FavouriteComponent,
    children: [{ path: '', loadChildren: () => import('./data-downloading/data-downloading.module').then((m) => m.DataDownloadingModule) }],
  },
  {
    path: 'mtruck',
    component: FavouriteComponent,
    children: [{ path: '', loadChildren: () => import('./truck-material/truck-material.module').then((m) => m.TruckMaterialModule) }],
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: FavouriteComponent,
    children: [{ path: '', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) }],
  },
  {
    path: '404',
    component: Page404Component,
  },
  {
    path: 'first-time',
    component: FirstTimeAccessComponent,
  },
  {
    path: '**',
    component: Page404Component,
  },
  // {
  //   path: 'news',
  //   component: FavouriteComponent,
  //   loadChildren: './news/news.module#NewsModule'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
