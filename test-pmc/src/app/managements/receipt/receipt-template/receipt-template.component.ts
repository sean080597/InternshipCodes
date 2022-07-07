import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FLOWS, HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';
import { OperationService } from '@app/_services/operation.service';
import { ReceiptService } from '@app/_services/receipt.service';

@Component({
  selector: 'app-receipt-template',
  templateUrl: './receipt-template.component.html',
  styleUrls: ['./receipt-template.component.scss']
})
export class ReceiptTemplateComponent implements OnInit {
  receiptTemplateList = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private receiptService: ReceiptService,
    private operationService: OperationService,
  ) { }

  ngOnInit(): void {
    this.commonService.addHeaderLeftCorner({ message: 'RECEIPT_LIST.RECEIPT_CREATION' });
    this.commonService.setCurrentFlow(FLOWS.RECEIPT)
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04003).subscribe()
    this.getAllReceiptTemplate();
  }

  getAllReceiptTemplate() {
    this.receiptService.getAllTemplate().subscribe(res => {
      this.receiptTemplateList = res;
    })
  }

  createReceiptTemplate(selectedTemplateId) {
    this.router.navigate(['managements/receipt/create', this.route.snapshot.params], { state: { selectedTemplateId } });
  }

  createNewReceipt() {
    this.router.navigate(['managements/receipt/create', this.route.snapshot.params]);
  }

}
