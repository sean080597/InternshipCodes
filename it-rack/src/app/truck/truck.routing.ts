import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { STruckDetailComponent } from './detail/detail.component';

import { TruckComponent } from './truck.component';

const routes: Routes = [
  { path: '', component: TruckComponent },
  { path: 'truck-detail/:shipmentNumber', component: STruckDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckRoutingModule {}
