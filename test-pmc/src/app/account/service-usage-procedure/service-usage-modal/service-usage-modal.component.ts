import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertService } from '@app/_services';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-service-usage-modal',
  templateUrl: './service-usage-modal.component.html',
  styleUrls: ['./service-usage-modal.component.scss']
})
export class ServiceUsageModalComponent implements OnInit {
  safeURL: SafeResourceUrl

  constructor(
    private bsModalRef: BsModalRef,
    private _sanitizer: DomSanitizer,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.alertService.getSteraVideoUrl().subscribe(data => {
      this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(data.videoUrl)
    })
  }

  // using iframe, so the bsModalRef does not have "content" property
  close(): void {
    this.bsModalRef.hide();
  }
}
