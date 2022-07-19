import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-remove-student-group-dialog',
  templateUrl: './remove-student-group-dialog.component.html',
  styleUrls: ['./remove-student-group-dialog.component.scss']
})
export class RemoveStudentGroupDialogComponent implements OnInit {

  constructor(
    private modal: NzModalRef,
  ) { }

  ngOnInit(): void {
  }
  destroyModal(isOk: boolean): void {
    this.modal.destroy({isSubmit: isOk})
  }
}
