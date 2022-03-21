import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { SharedService } from '@shared/shared.service';
import { TruckMaterialDetailReq, TruckMaterialDetailResp } from '@app/truck-material/truck-material.model';

@Injectable({
  providedIn: 'root',
})
export class STruckDetailService {
  private dataStore;

  location: Location;

  get data() {
    return this.dataStore;
  }

  constructor(location: Location, private http: HttpClient, public global: SharedService) {
    this.location = location;
  }

  getId() {
    let id = this.location.prepareExternalUrl(this.location.path());
    id = id.split('/').pop();
    return id;
  }

  public select(selectedNr?: any, selectedView?: any, selectedType?: any): Observable<TruckMaterialDetailResp> {
    const body: TruckMaterialDetailReq = {
      shipmentNumbers: '',
      deliveryNumbers: '',
      materialNumbers: '',
    };

    if (selectedView === 'shipment') {
      body.shipmentNumbers = selectedNr;
    } else if (selectedView === 'delivery') {
      body.deliveryNumbers = selectedNr;
    } else if (selectedView === 'material') {
      body.materialNumbers = selectedNr;
    }

    const url = `${this.global.truckApiUrl}/truck/relation`;
    return this.http.post<TruckMaterialDetailResp>(url, body);
  }

  detail(selectedNr?: any, selectedView?: any): Observable<Response> {
    let url = `${this.global.truckApiUrl}/truck/relation-detail`;
    if (selectedView === 'shipment') {
      url = `${this.global.truckApiUrl}/truck/relation-detail/${selectedNr.shipmentNumber}`;
    } else if (selectedView === 'delivery') {
      url = `${this.global.truckApiUrl}/truck/relation-detail/${selectedNr.deliveryNumber}`;
    } else if (selectedView === 'material') {
      url = `${this.global.truckApiUrl}/truck/relation-detail/${selectedView.deliveryNumber}/${selectedView.materialNumber}`;
    }
    return this.http.get<Response>(url);
  }
}
