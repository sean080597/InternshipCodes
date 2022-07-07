import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@app/_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-images-register-list-modal',
  templateUrl: './images-register-list-modal.component.html',
  styleUrls: ['./images-register-list-modal.component.scss']
})
export class ImagesRegisterListModalComponent implements OnInit, OnDestroy {
  @Input('typeIdOnly') typeIdOnly: string;
  @Input('customTitle') customTitle: string;
  @Input('storeScreenId') storeScreenId = '';

  constructor(private bsModalRef: BsModalRef, private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.setActionsBarOnTop(true)
  }

  ngOnDestroy(): void {
    this.commonService.setActionsBarOnTop(false)
  }

  close(): void {
    this.bsModalRef.content.onClose.next({storeScreenId: this.storeScreenId})
    this.bsModalRef.hide();
  }

  onConfirmed(evt) {
    this.bsModalRef.content.onClose.next({...evt, storeScreenId: this.storeScreenId})
    this.bsModalRef.hide();
  }
}
