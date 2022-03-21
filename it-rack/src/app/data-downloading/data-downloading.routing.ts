import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataDownloadingComponent } from './data-downloading.component';

const routes: Routes = [{ path: '', component: DataDownloadingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataDownloadingRoutingModule {}
