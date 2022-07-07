import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-creation-modal',
  templateUrl: './user-creation-modal.component.html',
  styleUrls: ['./user-creation-modal.component.scss']
})
export class UserCreationModalComponent implements OnInit {

  constructor(private bsModalRef: BsModalRef) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.bsModalRef.content.onClose.next(true);
    this.bsModalRef.hide();
  }

}
