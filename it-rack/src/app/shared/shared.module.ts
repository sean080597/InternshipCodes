import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TrackingRemarkComponent } from '@shared/components/tracking-remark/tracking-remark.component';
import { MaterialComponentsModule } from './material.module';
import { DevExtremeComponentsModule } from './devExtreme.module';
import { LoadingComponent } from './components/loading/loading.component';
import { ManageViewComponent } from './components/manage-view/manage-view.component';
import { SummaryWidgetComponent } from './components/summary-widget/summary-widget.component';
import { TypeofPipe } from './pipes/typeof.pipe';
import { ShipmentLogsComponent } from './components/shipment-logs/shipment-logs.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, MaterialComponentsModule, DevExtremeComponentsModule, ScrollingModule],
  exports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MaterialComponentsModule,
    DevExtremeComponentsModule,
    TrackingRemarkComponent,
    LoadingComponent,
    ManageViewComponent,
    SummaryWidgetComponent,
    ShipmentLogsComponent,
    TypeofPipe,
  ],
  declarations: [TrackingRemarkComponent, LoadingComponent, ManageViewComponent, SummaryWidgetComponent, ShipmentLogsComponent, TypeofPipe],
})
export class SharedModule {}
