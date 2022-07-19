import { Component, Input, OnInit } from '@angular/core';
import { ClassManagementService } from '../../service/class-management.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-move-student-group-dialog',
  templateUrl: './move-student-group-dialog.component.html',
  styleUrls: ['./move-student-group-dialog.component.scss']
})
export class MoveStudentGroupDialogComponent implements OnInit {
  @Input() data: any;
  groupList$: any = [];

  selectedGroup: any = null;
  inputtedGroupEnglish: any = null;
  inputtedGroupChinese: any = null;

  constructor(
    private _classManagementService: ClassManagementService,
    private modal: NzModalRef,
    private msg: NzMessageService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.groupList$ = this._classManagementService.getGroupByClassId(this.data.classId);
    this.groupList$.subscribe(res => console.log(res))
  }


  destroyModal(isOk: boolean): void {
    if (isOk) {
      if (!this.selectedGroup && !this.inputtedGroupChinese && !this.inputtedGroupEnglish) {
        this.msg.error(this.translateService.instant('err_missing_input_task'));
      } 
      if (this.inputtedGroupChinese && this.inputtedGroupEnglish && !this.selectedGroup) {
        const submitData = {
          id: this.data.classId,
          titleChinese: this.inputtedGroupChinese,
          titleEnglish: this.inputtedGroupEnglish,
        };
        this._classManagementService.createNewGroup(submitData).subscribe(
          data => this.modal.destroy({isSubmit: isOk, data: data})
        );
      }
      if (this.selectedGroup) {
        this.modal.destroy({isSubmit: isOk, data: this.selectedGroup})
      }
    } else {
      this.modal.destroy({isSubmit: isOk, data: null});
    }
  }
}
