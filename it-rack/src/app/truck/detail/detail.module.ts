import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { STruckDetailComponent, MShipmentDialog, MDeliveryDialog, MMaterialDialog } from './detail.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [STruckDetailComponent, MShipmentDialog, MDeliveryDialog, MMaterialDialog],
  entryComponents: [MShipmentDialog, MDeliveryDialog, MMaterialDialog],
  exports: [STruckDetailComponent],
})
export class STruckDetailModule {}
