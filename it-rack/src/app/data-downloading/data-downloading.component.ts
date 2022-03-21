import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DURATION } from '@app/shared/constants';
import { DevExtremeService } from '@app/shared/dev-extreme.service';
import { SharedService } from '@app/shared/shared.service';
import { FilterDataResponseBody, TruckTrackingRequestBody } from '@app/truck/truck.model';
import { TruckService } from '@app/truck/truck.service';
import moment from 'moment';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-data-downloading',
  templateUrl: './data-downloading.component.html',
  styleUrls: ['./data-downloading.component.scss'],
})
export class DataDownloadingComponent implements OnInit {
  dateFormat = 'yyyy/MM/dd';
  dateFormatMoment = 'YYYY/MM/DD';
  isMissingDate: boolean = false;

  shippingPointFilter: { text: string; value: string }[] = [];
  shipToPartyFilter: { text: string; value: string }[] = [];
  desCityFilter: { text: string; value: string }[] = [];
  desRegionFilter: { text: string; value: string }[] = [];
  cusFilter: { text: string; value: string }[] = [];
  lspFilter: { text: string; value: string }[] = [];
  opFilter: { text: string; value: string }[] = [];
  transTypeFilter: { text: string; value: string }[] = [];
  milestonesFilter: { text: string; value: number }[] = [];

  errorMsgPlanPickupDateFrom: any = null;
  errorMsgPlanPickupDateTo: any = null;
  errorMsgActualPickupDateFrom: any = null;
  errorMsgActualPickupDateTo: any = null;
  errorMsgReqDeliveryDateFrom: any = null;
  errorMsgReqDeliveryDateTo: any = null;
  errorMsgActDeliveryDateFrom: any = null;
  errorMsgActDeliveryDateTo: any = null;

  isValidPlanPickupDateFrom: boolean = true;
  isValidPlanPickupDateTo: boolean = true;
  isValidActualPickupDateFrom: boolean = true;
  isValidActualPickupDateTo: boolean = true;
  isValidReqDeliveryDateFrom: boolean = true;
  isValidReqDeliveryDateTo: boolean = true;
  isValidActDeliveryDateFrom: boolean = true;
  isValidActDeliveryDateTo: boolean = true;

  planPickupDateFrom: Date;
  planPickupDateTo: Date;
  actualPickupDateFrom: Date;
  actualPickupDateTo: Date;
  reqDeliveryDateFrom: Date;
  reqDeliveryDateTo: Date;
  actDeliveryDateFrom: Date;
  actDeliveryDateTo: Date;

  shippingPoint: string[] = [];
  shipToParty: string[] = [];
  desCity: string[] = [];
  desRegion: string[] = [];
  cusCode: string[] = [];
  lspCode: string[] = [];
  opCode: string[] = [];
  transType: string[] = [];
  milestones: string[] = [];

  constructor(private truckService: TruckService, private sharedService: SharedService, private dxService: DevExtremeService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initFilterDataSource();
  }

  private initFilterDataSource(): void {
    this.truckService.getFilterData(true).subscribe((res: FilterDataResponseBody) => {
      this.shippingPointFilter = res.data.shippingPoint.map((t) => {
        return { text: t, value: t };
      });
      this.shipToPartyFilter = res.data.shipToParty.map((t) => {
        return { text: t, value: t };
      });
      this.desCityFilter = res.data.destinationCity.map((t) => {
        return { text: t, value: t };
      });
      this.desRegionFilter = res.data.destinationRegion.map((t) => {
        return { text: t, value: t };
      });
      this.cusFilter = res.data.customerCode.map((t) => {
        return { text: t, value: t };
      });
      this.lspFilter = res.data.lsp.map((t) => {
        return { text: t, value: t };
      });
      this.opFilter = res.data.opCode.map((t) => {
        return { text: t, value: t };
      });
      this.transTypeFilter = res.data.transType.map((t) => {
        return { text: t, value: t };
      });
      this.milestonesFilter = res.data.milestones.map((t) => {
        return { text: t.value, value: t.key };
      });
    });
  }

  checkHasDateValue() {
    return this.planPickupDateFrom || this.actualPickupDateFrom || this.reqDeliveryDateFrom || this.actDeliveryDateFrom;
  }

  checkValidDate() {
    return (
      this.isValidPlanPickupDateFrom &&
      this.isValidPlanPickupDateTo &&
      this.isValidActualPickupDateFrom &&
      this.isValidActualPickupDateTo &&
      this.isValidReqDeliveryDateFrom &&
      this.isValidReqDeliveryDateTo &&
      this.isValidActDeliveryDateFrom &&
      this.isValidActDeliveryDateTo
    );
  }

  validateForm() {
    this.isMissingDate = !this.checkHasDateValue();
    return this.checkHasDateValue() && this.checkValidDate();
  }

  formatDateRequest(d: Date) {
    return d ? moment(d).format(this.dateFormatMoment) : '';
  }

  formatSelectionRequest(arr: string[], filterSource: Array<any>) {
    return arr.length !== filterSource.length ? arr.join(' ') : '';
  }

  // onValueChanged(e) {
  //   const fieldLabel = (<HTMLElement>e.element).getAttribute('aria-label');
  //   if (fieldLabel.includes('From')) {
  //     const fieldName = fieldLabel.substring(0, fieldLabel.indexOf('From')) + 'To';
  //     this.setDateValue(fieldName, e.value);
  //   } else if (fieldLabel.includes('To')) {
  //     const fieldName = fieldLabel.substring(0, fieldLabel.indexOf('To')) + 'From';
  //     this.setDateValue(fieldName, e.value);
  //   }
  // }

  // setDateValue(fieldName, value) {
  //   switch (fieldName) {
  //     case 'planPickupDateFrom':
  //       this.planPickupDateFrom = this.planPickupDateFrom ?? value;
  //       break;
  //     case 'planPickupDateTo':
  //       this.planPickupDateTo = this.planPickupDateTo ?? value;
  //       break;
  //     case 'actualPickupDateFrom':
  //       this.actualPickupDateFrom = this.actualPickupDateFrom ?? value;
  //       break;
  //     case 'actualPickupDateTo':
  //       this.actualPickupDateTo = this.actualPickupDateTo ?? value;
  //       break;
  //     case 'reqDeliveryDateFrom':
  //       this.reqDeliveryDateFrom = this.reqDeliveryDateFrom ?? value;
  //       break;
  //     case 'reqDeliveryDateTo':
  //       this.reqDeliveryDateTo = this.reqDeliveryDateTo ?? value;
  //       break;
  //     case 'actDeliveryDateFrom':
  //       this.actDeliveryDateFrom = this.actDeliveryDateFrom ?? value;
  //       break;
  //     case 'actDeliveryDateTo':
  //       this.actDeliveryDateTo = this.actDeliveryDateTo ?? value;
  //       break;
  //     default:
  //       break;
  //   }
  // }

  onSave() {
    if (this.validateForm()) {
      this.snackBar.open('After a successful search, a download will be prepared in the background. Please be patient, due to the amount of data.', '', { duration: SNACKBAR_DURATION, });
      this.sharedService.showLoading();
      const data: TruckTrackingRequestBody = {
        plannedPickupDateFrom: this.formatDateRequest(this.planPickupDateFrom),
        plannedPickupDateTo: this.formatDateRequest(this.planPickupDateTo),
        actualPickupDateFrom: this.formatDateRequest(this.actualPickupDateFrom),
        actualPickupDateTo: this.formatDateRequest(this.actualPickupDateTo),
        requiredDeliveryDateFrom: this.formatDateRequest(this.reqDeliveryDateFrom),
        requiredDeliveryDateTo: this.formatDateRequest(this.reqDeliveryDateTo),
        actualDeliveryDateFrom: this.formatDateRequest(this.actDeliveryDateFrom),
        actualDeliveryDateTo: this.formatDateRequest(this.actDeliveryDateTo),
        shippingPoint: this.formatSelectionRequest(this.shippingPoint, this.shippingPointFilter),
        shipToParty: this.formatSelectionRequest(this.shipToParty, this.shipToPartyFilter),
        shipToCity: this.formatSelectionRequest(this.desCity, this.desCityFilter),
        destinationRegion: this.formatSelectionRequest(this.desRegion, this.desRegionFilter),
        customerCode: this.formatSelectionRequest(this.cusCode, this.cusFilter),
        supplierName: this.formatSelectionRequest(this.lspCode, this.lspFilter),
        operatorCode: this.formatSelectionRequest(this.opCode, this.opFilter),
        transportType: this.formatSelectionRequest(this.transType, this.transTypeFilter),
        milestone: this.formatSelectionRequest(this.milestones, this.milestonesFilter),
      };
      this.truckService
        .exportDataDownloading(data)
        .pipe(
          map((response) => {
            const errorMessage = response.headers.get('Error');
            if (errorMessage) {
              this.snackBar.open(errorMessage, '', { duration: SNACKBAR_DURATION });
              return;
            } else {
              return this.dxService.handleDownloadingResponse(response);
            }
          }),
          catchError(() => {
            this.snackBar.open('file download failed', '', { duration: SNACKBAR_DURATION });
            return of([]);
          }),
          finalize(() => this.sharedService.hideLoading())
        )
        .subscribe();
    }
  }

  onClear() {
    this.shippingPoint = [];
    this.shipToParty = [];
    this.desCity = [];
    this.desRegion = [];
    this.cusCode = [];
    this.lspCode = [];
    this.opCode = [];
    this.transType = [];
    this.milestones = [];
  }
}
