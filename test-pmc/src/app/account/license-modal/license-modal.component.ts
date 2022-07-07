import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/_services';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-license-modal',
  templateUrl: './license-modal.component.html',
  styleUrls: ['./license-modal.component.scss']
})
export class LicenseModalComponent implements OnInit {
  content: string = ''

  constructor(
    private bsModalRef: BsModalRef,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.alertService.getLicense().subscribe(data => this.content = data)
  }

  close(): void {
    this.bsModalRef.content.onClose.next(true);
    this.bsModalRef.hide();
  }
}
