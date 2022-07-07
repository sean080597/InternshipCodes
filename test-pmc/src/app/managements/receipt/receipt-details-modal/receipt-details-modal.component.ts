import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReceiptService } from '@app/_services/receipt.service';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { COMMON_CONFIGS } from '@app/_constants';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-receipt-details-modal',
  templateUrl: './receipt-details-modal.component.html',
  styleUrls: ['./receipt-details-modal.component.scss']
})
export class ReceiptDetailsModalComponent implements OnInit, OnDestroy {
  @Input('imageId') imageId: string = ''
  private unsubscribe = new Subject<void>();
  receiptData: any

  constructor(private bsModalRef: BsModalRef, private receiptService: ReceiptService) { }

  ngOnInit(): void {
    this.receiptService.getReceiptDetail(this.imageId).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.receiptData = {
        receiptLabel: res.receiptLabel,
        remarks: res.remarks,
        thumbnail: res.thumbnailImageFilePath,
        contentData: res.contentData,
        lastUpdateDate: moment(res.lastUpdateDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM),
        registrationDate: moment(res.registrationDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM)
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  close(): void {
    this.bsModalRef.hide();
  }

  confirmImage() {
    this.bsModalRef.content.onClose.next(true)
    this.bsModalRef.hide()
  }
}
