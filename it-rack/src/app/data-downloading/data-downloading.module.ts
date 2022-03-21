import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { DataDownloadingComponent } from './data-downloading.component';
import { DataDownloadingRoutingModule } from './data-downloading.routing';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, SharedModule, DataDownloadingRoutingModule],
  exports: [DataDownloadingComponent],
  declarations: [DataDownloadingComponent],
  providers: [DatePipe],
})
export class DataDownloadingModule {}
