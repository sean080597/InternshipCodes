import { NgModule } from '@angular/core';
import {
  DxButtonModule,
  DxChartModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownButtonModule,
  DxPopupModule,
  DxProgressBarModule,
  DxRadioGroupModule,
  DxScrollViewModule,
  DxTagBoxModule,
  DxTooltipModule,
} from 'devextreme-angular';

@NgModule({
  exports: [
    DxChartModule,
    DxDataGridModule,
    DxButtonModule,
    DxProgressBarModule,
    DxPopupModule,
    DxDropDownButtonModule,
    DxRadioGroupModule,
    DxTooltipModule,
    DxTagBoxModule,
    DxDateBoxModule,
    DxScrollViewModule,
  ],
})
export class DevExtremeComponentsModule {}
