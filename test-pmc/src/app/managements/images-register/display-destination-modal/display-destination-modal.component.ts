import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DESTINATION_TYPES, HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { OperationService } from '@app/_services/operation.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-display-destination-modal',
  templateUrl: './display-destination-modal.component.html',
  styleUrls: ['./display-destination-modal.component.scss']
})
export class DisplayDestinationModalComponent implements OnInit {
  desCustomer: { id: DESTINATION_TYPES, title: string, image: string }
  desReceipt: { id: DESTINATION_TYPES, title: string, image: string }

  constructor(
    private router: Router,
    private bsModalRef: BsModalRef,
    private imageRegisteredService: ImageRegisteredService,
    private commonService: CommonService,
    private operationService: OperationService,
  ) {
    this.desCustomer = this.imageRegisteredService.DISPLAY_DESTINATIONS.find(t => t.id === DESTINATION_TYPES.CUSTOMER_DISPLAY)
    this.desReceipt = this.imageRegisteredService.DISPLAY_DESTINATIONS.find(t => t.id === DESTINATION_TYPES.RECEIPT_IMAGE)
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS03005)
  }

  close(): void {
    this.bsModalRef.hide();
  }

  onSelectDestination(id: DESTINATION_TYPES) {
    this.bsModalRef.content.onClose.next({ key: 'openCreateImageModal', selectedType: id });
    this.bsModalRef.hide();
  }
}
