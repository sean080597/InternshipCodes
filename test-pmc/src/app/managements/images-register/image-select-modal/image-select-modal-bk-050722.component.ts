import { AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DESTINATION_TYPES, IMAGE_LIST_TYPES, SORTING_OPTS } from '@app/_constants';
import { ImageRegistered } from '@app/_models/image-registered';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { ReceiptService } from '@app/_services/receipt.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-image-select-modal',
  template: '<div></div>',
  styleUrls: ['./image-select-modal.component.scss']
})
export class ImageSelectModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  @Input('imageListType') imageListType = '';
  @Input('showSelection') showSelection = true;
  dragDropFiles = []
  fileName = ''

  destinationTypes = DESTINATION_TYPES
  imagesList: ImageRegistered[] = [];

  constructor(
    private bsModalRef: BsModalRef,
    private imageService: ImageRegisteredService,
    private receiptService: ReceiptService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    if (this.imageListType) this.getImageList(this.imageListType)
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngOnDestroy(): void {
    this.commonService.setActionsBarTemplate(null)
  }

  getImageList(imageListType: string) {
    if (imageListType === IMAGE_LIST_TYPES.imageListCustomerDisplay || imageListType === IMAGE_LIST_TYPES.imageListReceiptImage) {
      const options = { type: imageListType, sortBy: SORTING_OPTS.LAST_DESC }
      this.imageService.getAllImageList(options).subscribe(res => {
        this.imagesList = res.items.slice(0, 4)
      })
    } else if (imageListType === IMAGE_LIST_TYPES.receiptList) {
      this.receiptService.getAllReceipt().subscribe(res => {
        this.imagesList = res.items.slice(0, 4)
      })
    }
  }

  close(): void {
    this.bsModalRef.hide();
  }

  onFileChange(pFileList: File[]) {
    if (pFileList.length > 0 && this.imageService.validateInputImageFile(pFileList[0])) {
      this.dragDropFiles = Object.keys(pFileList).map(key => pFileList[key])
      this.fileName = this.dragDropFiles[0]?.name;
      this.openNewImageModal()
    }
  }

  openNewImageModal() {
    const initialState = { key: 'openNewImageModal', dragDropFile: this.dragDropFiles[0] }
    this.bsModalRef.content.onClose.next(initialState);
    this.bsModalRef.hide();
  }

  openImageSelection() {
    this.bsModalRef.content.onClose.next({ key: 'openImageSelection' });
    this.bsModalRef.hide();
  }

  selectImg(image) {
    this.bsModalRef.content.onClose.next({ key: 'selectImage', selectedImage: image });
    this.bsModalRef.hide();
  }
}
