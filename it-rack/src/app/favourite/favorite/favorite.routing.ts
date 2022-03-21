import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteComponent } from './favorite.component';
import { CDynamicComponent } from './containerFavorite/dynamic.component';
import { SDynamicComponent } from './shipmentFavorite/dynamic.component';
import { MDynamicComponent } from './materialFavorite/dynamic.component';
import { TruckFavoriteComponent } from './truck-favorite/truck-favorite.component';
import { CDetailComponent } from '@app/container/detail/detail.component';
import { SDetailComponent } from '@app/shipment/detail/detail.component';
import { MDetailComponent } from '@app/material/detail/detail.component';
import { STruckDetailComponent } from '@app/truck/detail/detail.component';

const routes: Routes = [
  { path: 'cfavorite', component: CDynamicComponent },
  { path: 'sfavorite', component: SDynamicComponent },
  { path: 'mfavorite', component: MDynamicComponent },
  { path: 'tfavorite', component: TruckFavoriteComponent },
  { path: '', component: FavoriteComponent },
  { path: 'cfavorite/fcdetail/:containerNumber', component: CDetailComponent },
  { path: 'sfavorite/fsdetail/:shipmentNumber', component: SDetailComponent },
  { path: 'mfavorite/fmdetail/:materialNumber', component: MDetailComponent },
  { path: 'tfavorite/tfdetail/:shipmentNumber', component: STruckDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteRoutingModule {}
