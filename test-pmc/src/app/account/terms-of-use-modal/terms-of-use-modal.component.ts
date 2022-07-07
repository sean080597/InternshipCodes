import {Component, OnInit} from '@angular/core';
import { AlertService } from '@app/_services';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-terms-of-use-modal',
  templateUrl: './terms-of-use-modal.component.html',
  styleUrls: ['./terms-of-use-modal.component.scss']
})
export class TermsOfUseModalComponent implements OnInit {
  content: string = ``

  constructor(
    private bsModalRef: BsModalRef,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.alertService.getTermOfUse().subscribe(data => this.content = data)
  }

  close(): void {
    this.bsModalRef.content.onClose.next(true);
    this.bsModalRef.hide();
  }
}
