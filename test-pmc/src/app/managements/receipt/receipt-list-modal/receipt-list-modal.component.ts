import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '@app/_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ReceiptListComponent } from '../receipt-list/receipt-list.component';

@Component({
  selector: 'app-receipt-list-modal',
  templateUrl: './receipt-list-modal.component.html',
  styleUrls: ['./receipt-list-modal.component.scss']
})
export class ReceiptListModalComponent implements OnInit, OnDestroy {
  @Input('storeScreenId') storeScreenId = '';
  @ViewChild(ReceiptListComponent) receiptChildCmp: ReceiptListComponent;
  private windowTab = [];

  constructor(private bsModalRef: BsModalRef, private commonService: CommonService) { }

  ngOnInit(): void {
    this.commonService.setActionsBarOnTop(true)
  }

  ngOnDestroy(): void {
    this.commonService.setActionsBarOnTop(false)
  }

  close(): void {
    this.bsModalRef.content.onClose.next({storeScreenId: this.storeScreenId});
    this.bsModalRef.hide();
  }

  onConfirmed(evt) {
    this.bsModalRef.content.onClose.next({...evt, storeScreenId: this.storeScreenId});
    this.bsModalRef.hide();
  }
  createPlaylist() {
    const getLocalOrigin =`${window.location.origin}`;
    const windowTab = window.open(getLocalOrigin + `/managements/receipt/template;createNewTab=${this.windowTab.length + 1}`);
    this.windowTab.push(windowTab);

    window.addEventListener('storage', () => {
      // When local storage changes, dump the list to
      const tabIndexReceipt = parseInt(JSON.parse(window.localStorage.getItem('tabIndexReceipt')));
      if (tabIndexReceipt) {
        setTimeout(() => {
          this.windowTab[tabIndexReceipt - 1].close();
          window.localStorage.removeItem('tabIndexReceipt');
        }, 1000);
        this.onReset();
      }
    });
  }

  onReset() {
    this.receiptChildCmp.resetSearchFilter()
  }
}
