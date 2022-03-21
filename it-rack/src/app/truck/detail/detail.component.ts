import { Component, OnInit, Inject } from '@angular/core';
import { NavigationService } from '@app/favourite/navigation/navigation.service';
import { STruckDetailService } from './detail.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

export interface DialogData {
  selectedId: string;
  containerType: string;
  containerWeight: string;
  serviceType: string;
  pol: string;
  pod: string;
  consigneeName: string;
  carrierName: string;
  vesselName: string;
  mbl: string;
  hblNumber: string;
  shipmentWeight: string;
  shipmentVolume: string;
  loadingEndDate: string;
  shipmentEndDate: string;
  plant: string;
  shippingPoint: string;
  shipToParty: string;
  soldToParty: string;
  shippingCondition: string;
  planGiDate: string;
  deliveryDate: string;
  materialDescription: string;
  materialPcs: string;
  soNumber: string;
  poNumber: string;
  poCreator: string;
  invoiceNumber: string;
  productionPlant: string;
  purchasingPlant: string;
  shipperName: string;
  containerNumber: string;
  consigneeCity: string;
}
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class STruckDetailComponent implements OnInit {
  shipmentNumbers = [];
  deliveryNumbers = [];
  materialNumbers = [];

  public originalId = '';
  public latestUpdateTime = '';
  isLoadingResults = false;

  constructor(private service: STruckDetailService, public dialog: MatDialog, private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.pathStatus.emit('truck-detail');
    this.originalId = this.service.getId().split('?id=').reverse().pop();
    this.queryRelation(this.originalId, 'shipment', 'relation');
  }

  resetToDefault() {
    this.ngOnInit();
  }

  queryByShipment(v: string) {
    const selectedView = 'shipment';
    const selectedType = 'relation';
    this.queryRelation(v, selectedView, selectedType);
  }

  queryByDelivery(v: string) {
    const selectedView = 'delivery';
    const selectedType = 'relation';
    this.queryRelation(v, selectedView, selectedType);
  }

  queryByMaterial(v: string) {
    const selectedView = 'material';
    const selectedType = 'relation';
    this.queryRelation(v, selectedView, selectedType);
  }

  queryRelation(selectedNr: string, selectedView: string, selectedType: string) {
    this.isLoadingResults = true;
    this.service.select(selectedNr, selectedView, selectedType).subscribe(
      (result) => {
        const data = result.data;
        this.shipmentNumbers = data.shipmentNumbers;
        this.deliveryNumbers = data.deliveryNumbers;
        this.materialNumbers = data.materialNumbers;

        this.latestUpdateTime = data.lastUpdate;
        this.isLoadingResults = false;
      },
      (error) => {
        this.isLoadingResults = false;
      }
    );
  }

  openSDialog(v): void {
    const dialogRef = this.dialog.open(MShipmentDialog, {
      width: '550px',
      data: {
        selectedId: v,
        shipmentWeight: '',
        shipmentVolume: '',
        loadingEndDate: '',
        shipmentEndDate: '',
        hblNumber: '',
        consigneeCity: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openDDialog(v: string): void {
    const dialogRef = this.dialog.open(MDeliveryDialog, {
      width: '550px',
      data: {
        selectedId: v,
        plant: '',
        shippingPoint: '',
        shipToParty: '',
        soldToParty: '',
        shippingCondition: '',
        planGiDate: '',
        deliveryDate: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openMDialog(v): void {
    const dialogRef = this.dialog.open(MMaterialDialog, {
      width: '550px',
      data: {
        selectedId: v,
        materialDescription: '',
        materialPcs: '',
        soNumber: '',
        poNumber: '',
        poCreator: '',
        invoiceNumber: '',
        purchasingPlant: '',
        productionPlant: '',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'shipment-dialog',
  templateUrl: 'shipment-dialog.html',
  styleUrls: ['./detail.component.scss'],
})
export class MShipmentDialog {
  sDetails: any = [];
  isLoadingResults = true;
  isRateLimitReached = false;
  constructor(private service: STruckDetailService, public dialogRef: MatDialogRef<MShipmentDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    // console.log('data', data);
    const selectedView = 'shipment';
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.detail(data.selectedId, selectedView);
        }),
        map((response) => {
          this.sDetails = response;
          data.shipmentWeight = this.sDetails.data.shipmentWeight;
          data.shipmentVolume = this.sDetails.data.shipmentVolume;
          data.loadingEndDate = this.sDetails.data.loadingEndDate;
          data.shipmentEndDate = this.sDetails.data.shipmentEndDate;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return response;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((response) => (this.sDetails = response));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delivery-dialog',
  templateUrl: 'delivery-dialog.html',
  styleUrls: ['./detail.component.scss'],
})
export class MDeliveryDialog {
  dDetails: any = [];
  isLoadingResults = true;
  isRateLimitReached = false;
  constructor(private service: STruckDetailService, public dialogRef: MatDialogRef<MDeliveryDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    // console.log('data', data);
    const selectedView = 'delivery';
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.detail(data.selectedId, selectedView);
        }),
        map((response) => {
          this.dDetails = response;
          data.plant = this.dDetails.data.plant;
          data.shippingPoint = this.dDetails.data.shippingPoint;
          data.shipToParty = this.dDetails.data.shipToParty;
          data.soldToParty = this.dDetails.data.soldToParty;
          data.shippingCondition = this.dDetails.data.shippingCondition;
          data.planGiDate = this.dDetails.data.planGiDate;
          data.deliveryDate = this.dDetails.data.deliveryDate;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return response;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((response) => (this.dDetails = response));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'material-dialog',
  templateUrl: 'material-dialog.html',
  styleUrls: ['./detail.component.scss'],
})
export class MMaterialDialog {
  mDetails: any = [];
  isLoadingResults = true;
  isRateLimitReached = false;
  constructor(private service: STruckDetailService, public dialogRef: MatDialogRef<MMaterialDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    // console.log('data', data);
    const selectedView = 'material';
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.detail(data.selectedId, selectedView);
        }),
        map((response) => {
          this.mDetails = response;
          data.materialDescription = this.mDetails.data.materialDescription;
          data.materialPcs = this.mDetails.data.materialPcs;
          data.soNumber = this.mDetails.data.soNumber;
          data.poNumber = this.mDetails.data.poNumber;
          data.poCreator = this.mDetails.data.poCreator;
          data.purchasingPlant = this.mDetails.data.purchasingPlant;
          data.productionPlant = this.mDetails.data.productionPlant;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return response;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe((response) => (this.mDetails = response));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
