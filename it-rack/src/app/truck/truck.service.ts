import { Injectable } from '@angular/core';
import {
  TruckTrackingResponseBody,
  TruckTrackingRequestBody,
  ManageViewResponseBody,
  ManageViewRequestBody,
  ActiveViewResponseBody,
  SummaryWidgetResponseBody,
  SummaryWidgetData,
  ShipmentLogsResponseBody,
  TruckTracking,
  FilterDataResponseBody,
} from './truck.model';
import { GeneralResponseBody } from '@app/shared/shared.model';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SharedService } from '@shared/shared.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TruckService {

  constructor(private http: HttpClient, private global: SharedService) {}

  public randomminmax(min, max) {
    return min + Math.random() * (max - min);
  }

  public getTruckTrackingSummary(request: TruckTrackingRequestBody): Observable<TruckTrackingResponseBody> {
    console.log('getTruckTrackingSummary', `${this.global.truckApiUrl}/truck/summary-by-sql`)
    console.log('getTruckTrackingSummary req ==> ', request)
    // return this.http.post<TruckTrackingResponseBody>(`${this.global.truckApiUrl}/truck/summary-by-sql`, request);
    return of(JSON.parse(localStorage.getItem('test_truck_summary')))
  }

  public getFavoriteTruckTrackingSummary(request: TruckTrackingRequestBody): Observable<TruckTrackingResponseBody> {
    console.log('getFavoriteTruckTrackingSummary', request)
    // return this.http.post<TruckTrackingResponseBody>(`${this.global.userAppUrl}/user/favorite/showFavoriteView`, request);
    return of(JSON.parse(localStorage.getItem('test_truck_summary')))
  }

  public getShippingPointsDesc(): Observable<GeneralResponseBody> {
    console.log('getShippingPointsDesc')
    // return this.http.get<GeneralResponseBody>(`${this.global.truckApiUrl}/truck/shipping-points/description`);
    return of(JSON.parse(localStorage.getItem('test_desc')))
  }

  public updateReqDeliveryDate(id: number, reqDeliveryDate: string) {
    console.log('updateReqDeliveryDate ==> ', `${this.global.truckApiUrl}/truck/${id}/revise-require-delivery-date`, ' - req => ', reqDeliveryDate)
    // return this.http.post(`${this.global.truckApiUrl}/truck/${id}/revise-require-delivery-date`, reqDeliveryDate);
    return of(JSON.parse(localStorage.getItem('test_create_delete')))
  }

  public getManageViewList(userId: number): Observable<ManageViewResponseBody> {
    console.log('getManageViewList => ', `${this.global.userAppUrl}/user-view/all/${userId}`)
    // return this.http.get<ManageViewResponseBody>(`${this.global.userAppUrl}/user-view/all/${userId}`);
    return of(JSON.parse(localStorage.getItem('test_manageview')))
  }

  public deleteManageViewItem(id: number): Observable<ManageViewResponseBody>{
    console.log('deleteManageViewItem => ', `${this.global.userAppUrl}/user-view/delete/${id}`)
    // return this.http.delete<ManageViewResponseBody>(`${this.global.userAppUrl}/user-view/delete/${id}`);
    return of(JSON.parse(localStorage.getItem('test_create_delete')))
  }

  public createManageViewItem(data: ManageViewRequestBody): Observable<ManageViewResponseBody>{
    console.log('request ==> ', data)
    console.log('createManageViewItem => ', `${this.global.userAppUrl}/user-view/save`)
    // return this.http.post<ManageViewResponseBody>(`${this.global.userAppUrl}/user-view/save`, data)
    return of(JSON.parse(localStorage.getItem('test_create_delete')))
  }

  public updateActiveCondition(userId: number, viewId: number): Observable<ManageViewResponseBody>{
    console.log('updateActiveCondition => ', `${this.global.userAppUrl}/user-view/${userId}/active/${viewId}`)
    // return this.http.post<ManageViewResponseBody>(`${this.global.userAppUrl}/user-view/${userId}/active/${viewId}`, {})
    return of(JSON.parse(localStorage.getItem('test_create_delete')))
  }

  public getActiveManageViewItem(userId: number): Observable<ActiveViewResponseBody>{
    console.log('getActiveManageViewItem => ', `${this.global.userAppUrl}/user-view/get-active-view/${userId}`)
    // return this.http.get<ActiveViewResponseBody>(`${this.global.userAppUrl}/user-view/get-active-view/${userId}`)
    return of(JSON.parse(localStorage.getItem('test_manageview_active')))
  }

  public getSummaryWidgets(userId: number): Observable<Array<SummaryWidgetData>>{
    // const widgetUrls = [
    //   `${this.global.truckApiUrl}/truck/widget/last-7-days`,
    //   `${this.global.truckApiUrl}/truck/widget/delivery-today`,
    //   `${this.global.truckApiUrl}/truck/widget/urgent-last-7-days`
    // ]

    // const last7Days = this.http.get<SummaryWidgetResponseBody>(widgetUrls[0]).pipe(map((res: SummaryWidgetResponseBody) => {return {widgetType: 0, responseData: res}}))
    // const deliveryToday = this.http.get<SummaryWidgetResponseBody>(widgetUrls[1]).pipe(map((res: SummaryWidgetResponseBody) => {return {widgetType: 1, responseData: res}}))
    // const urgentLast7Days = this.http.get<SummaryWidgetResponseBody>(widgetUrls[2]).pipe(map((res: SummaryWidgetResponseBody) => {return {widgetType: 2, responseData: res}}))
    const last7Days = of(JSON.parse(localStorage.getItem('test_widgets_0'))).pipe(map((res: SummaryWidgetResponseBody) => {return {widgetType: 0, responseData: res}}))
    const deliveryToday = of(JSON.parse(localStorage.getItem('test_widgets_1'))).pipe(map((res: SummaryWidgetResponseBody) => {return {widgetType: 1, responseData: res}}))
    const urgentLast7Days = of(JSON.parse(localStorage.getItem('test_widgets_2'))).pipe(map((res: SummaryWidgetResponseBody) => {return {widgetType: 2, responseData: res}}))
    return forkJoin([last7Days, urgentLast7Days, deliveryToday]);
  }

  public getShipmentLogs(data: TruckTracking): Observable<ShipmentLogsResponseBody>{
    const query = 'shipmentNumber=' + data.shipmentNumber + '&roNumber=' + data.roNumber
    console.log('getShipmentLogs => ', `${this.global.truckApiUrl}/truck/shipment-log?${query}`)
    // return this.http.get<ShipmentLogsResponseBody>(`${this.global.truckApiUrl}/truck/shipment-log?${query}`)
    return of(JSON.parse(localStorage.getItem('test_shipmentlogs')))
  }

  public getFilterData(isDownload?: boolean): Observable<FilterDataResponseBody>{
    console.log('getFilterData => ', `${this.global.truckApiUrl}/truck/filter-data${isDownload ? '?download=true' : ''}`)
    // return this.http.get<FilterDataResponseBody>(`${this.global.truckApiUrl}/truck/filter-data${isDownload ? '?download=true' : ''}`)
    if(isDownload){
      return of(JSON.parse(localStorage.getItem('test_filter_data_download')))
    }
    return of(JSON.parse(localStorage.getItem('test_filter_data')))
  }

  public getTruckTrackingExcel(request: TruckTrackingRequestBody) {
    console.log('getTruckTrackingExcel => ', `${this.global.truckApiUrl}/export/truckexport`, ' - req => ', request)
    // return this.http.post(`${this.global.truckApiUrl}/export/truckexport`, request, { observe: 'response', responseType: 'blob' });
    const httpRes = new HttpResponse({
      headers: new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8'),
      status: 200,
      body: new Blob([JSON.stringify('blabjlah', null, 2)], { type: 'application/json' }),
      url: `${this.global.truckApiUrl}/export/truckexport`,
    })
    return of(httpRes);
  }

  public getFavoriteTruckTrackingExcel(request: TruckTrackingRequestBody) {
    console.log('getFavoriteTruckTrackingExcel => ', `${this.global.truckApiUrl}/export/truckfavorexport`, ' - req => ', request)
    // return this.http.post(`${this.global.truckApiUrl}/export/truckfavorexport`, request, { observe: 'response', responseType: 'blob' });
    const httpRes = new HttpResponse({
      headers: new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8'),
      status: 200,
      body: new Blob([JSON.stringify('blabjlah', null, 2)], { type: 'application/json' }),
      url: `${this.global.truckApiUrl}/export/truckexport`,
    })
    return of(httpRes);
  }

  public exportDataDownloading(request: TruckTrackingRequestBody){
    console.log('exportDataDownloading => ', `${this.global.truckApiUrl}/export/data`)
    console.log('exportDataDownloading req => ', request)
    // return this.http.post(`${this.global.truckApiUrl}/export/data`, request, { observe: 'response', responseType: 'blob' });
    const httpRes = new HttpResponse({
      headers: new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8'),
      status: 200,
      body: new Blob([JSON.stringify('blabjlah', null, 2)], { type: 'application/json' }),
      url: `${this.global.truckApiUrl}/export/truckexport`,
    })
    return of(httpRes);
  }
}
