import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { TruckRoutingModule } from './truck.routing';
import { TruckComponent } from './truck.component';
import { ShareEmailModule } from '@app/share-email/share-email.module';
import { STruckDetailModule } from './detail/detail.module';
import { DisplayModeComponent } from './display-mode/display-mode.component';
import { LastSevenDaysComponent } from './tooltips/last-seven-days/last-seven-days.component';
import { DeliveryTodayComponent } from './tooltips/delivery-today/delivery-today.component';
import { UrgentLastDaysComponent } from './tooltips/urgent-last-days/urgent-last-days.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, SharedModule, TruckRoutingModule, ReactiveFormsModule, ShareEmailModule, STruckDetailModule],
  declarations: [TruckComponent, DisplayModeComponent, LastSevenDaysComponent, DeliveryTodayComponent, UrgentLastDaysComponent],
  providers: [DatePipe],
})
export class TruckModule {}
