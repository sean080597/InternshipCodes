import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SHIPMENT_LOGS_LIST } from '@app/shared/constants';
import { ShipmentLog, ShipmentLogsResponseBody, TruckTracking } from '@app/truck/truck.model';
import { TruckService } from '@app/truck/truck.service';
import * as events from 'devextreme/events';

@Component({
  selector: 'app-shipment-logs',
  templateUrl: './shipment-logs.component.html',
  styleUrls: ['./shipment-logs.component.scss'],
})
export class ShipmentLogsComponent implements OnInit {
  @ViewChild('ShipmentLogs')
  shipmentLogsRef: ElementRef;

  @Input() isShipmentLogsVisible: boolean = false;
  @Input() shipmentLogData: TruckTracking;
  @Output() hideShipmentLogEvent = new EventEmitter();

  dataSource: ShipmentLog[];
  shipmentLogsList: Array<{ index: number; status: string }> = SHIPMENT_LOGS_LIST;

  constructor(private truckService: TruckService) {}

  ngOnInit(): void {
    this.getShipmentLogs(this.shipmentLogData);
  }

  // handle cannot scroll in dxpopup
  onContentReady(evt) {
    events.on(evt.component.content(), 'dxmousewheel', null, (ev) => {
      ev.stopPropagation();
    });
  }

  genHeight() {
    return this.shipmentLogsRef?.nativeElement?.offsetHeight + 100;
  }

  hidePopup() {
    this.hideShipmentLogEvent.emit(false);
  }

  getShipmentLogs(shipmentData: TruckTracking) {
    this.truckService.getShipmentLogs(shipmentData).subscribe((res: ShipmentLogsResponseBody) => {
      this.dataSource = this.genDataSource(res.data, this.shipmentLogsList);
    });
  }

  genDataSource(shipmentLogsAPI: ShipmentLog[], shipmentLogsList: Array<{ index: number; status: string }>): ShipmentLog[] {
    let result: ShipmentLog[] = [...shipmentLogsAPI];

    shipmentLogsList
      .filter((t) => !shipmentLogsAPI.some((u) => u.status === t.status))
      .map((t) => {
        return { index: t.index, color: 0, status: t.status, updateTime: null };
      })
      .forEach((t) => result.push(t));

    result.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0));
    return result;
  }

  genTrackingColor(status: number) {
    switch (status) {
      case 1:
        return 'step--green';
      case 2:
        return 'step--yellow';
      case 3:
        return 'step--red';
      default:
        return 'step--gray';
    }
  }
}
