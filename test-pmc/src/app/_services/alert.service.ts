import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from '@app/_models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ServiceUsageModalComponent } from '@app/account/service-usage-procedure/service-usage-modal/service-usage-modal.component';
import { TermsOfUseModalComponent } from '@app/account/terms-of-use-modal/terms-of-use-modal.component';
import { LicenseModalComponent } from '@app/account/license-modal/license-modal.component';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { OperationService } from './operation.service';
import { HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultId = 'default-alert';
    bsModalRef: BsModalRef;

    constructor(
      private modalService: BsModalService,
      private http: HttpClient,
      public commonService: CommonService,
      private operationService: OperationService
    ){}

    // enable subscribing to alerts observable
    onAlert(id = this.defaultId): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // convenience methods
    success(message: string, options?: any) {
        this.alert(new Alert({ ...options, type: AlertType.Success, message }));
    }

    error(message: string, options?: any) {
        this.alert(new Alert({ ...options, type: AlertType.Error, message }));
    }

    info(message: string, options?: any) {
        this.alert(new Alert({ ...options, type: AlertType.Info, message }));
    }

    warn(message: string, options?: any) {
        this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
    }

    // main alert method
    alert(alert: Alert) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    // clear alerts
    clear(id = this.defaultId) {
        this.subject.next(new Alert({ id }));
    }

    termsOfUseModal(callback?: any) {
      this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS97001).subscribe()
      this.bsModalRef = this.modalService.show(TermsOfUseModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
      this.bsModalRef.content.onClose = new Subject<boolean>();
      this.bsModalRef.content.onClose.subscribe(() => callback ? callback(this) : () => {})
    }

    serviceUsage(t?: any) {
      this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS98001).subscribe()
      const th = t ?? this
      th.bsModalRef = th.modalService.show(ServiceUsageModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
      th.bsModalRef.content.onClose = new Subject<boolean>();
      th.bsModalRef.content.onClose.subscribe()
    }

    license() {
      this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS97002).subscribe()
      this.bsModalRef = this.modalService.show(LicenseModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true });
      this.bsModalRef.content.onClose = new Subject<boolean>();
      this.bsModalRef.content.onClose.subscribe()
    }

    getTermOfUse(): Observable<any> {
      return this.http.get(`${environment.consent.termOfUse}`, {responseType: 'text'});
    }

    getLicense(): Observable<any> {
      return this.http.get(`${environment.consent.license}`, {responseType: 'text'});
    }

    getSteraVideoUrl(): Observable<any> {
      return this.http.get(`${environment.consent.steraVideoUrl}`, {responseType: 'json'});
    }
}
