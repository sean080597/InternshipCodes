import { Component, Input, OnInit } from '@angular/core';
import { COMMON_CONFIGS } from '@app/_constants';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-image-details-modal',
  templateUrl: './image-details-modal.component.html',
  styleUrls: ['./image-details-modal.component.scss']
})
export class ImageDetailsModalComponent implements OnInit {
  @Input('imageId') imageId: string = ''
  private unsubscribe = new Subject<void>();
  imageDetails: any

  constructor(private bsModalRef: BsModalRef, private imageRegisteredService: ImageRegisteredService,) { }

  ngOnInit(): void {
    this.imageRegisteredService.getImageDetails(this.imageId).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
      this.imageDetails = {
        ...res,
        registrationDate: moment(res.registrationDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM),
        lastUpdateDate: moment(res.lastUpdateDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM)
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
