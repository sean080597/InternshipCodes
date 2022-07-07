import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-new-registration-modal',
  templateUrl: './new-registration-modal.component.html',
  styleUrls: ['./new-registration-modal.component.scss']
})
export class NewRegistrationModalComponent implements OnInit, OnDestroy {
  @Input('dragDropFile') dragDropFile: File;
  @Input('typeIdOnly') typeIdOnly: string;

  constructor(
    private bsModalRef: BsModalRef,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.commonService.setActionsBarOnTop(true)
  }

  ngOnDestroy(): void {
    this.commonService.setActionsBarOnTop(false)
  }

  close(): void {
    this.bsModalRef.content.onClose.next(true)
    this.bsModalRef.hide();
  }

  onFinished(evt) {
    this.bsModalRef.content.onClose.next(evt)
    this.bsModalRef.hide();
  }
}
