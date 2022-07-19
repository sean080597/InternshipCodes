import { ClassManagementService } from '../../service/class-management.service';
import { Group } from '@app/pages/class/model/group.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject, Input } from '@angular/core';
import {  Observable } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NULL_UUID } from '@app/@core/constants';

@Component({
  selector: 'app-add-student-group-dialog',
  templateUrl: './add-student-group-dialog.component.html',
  styleUrls: ['./add-student-group-dialog.component.scss']
})
export class AddStudentGroupDialogComponent implements OnInit {
  public disableSubmit: boolean = true;

  @Input() data: any;
  group: any;
  selectedGroup: any;
  inputtedGroupEnglish: any = null;
  inputtedGroupChinese: any = null;
  disabled = false;
  constructor(
    private modal: NzModalRef,
    private _classManagementService: ClassManagementService,
  ) { }

  ngOnInit(): void {
    this._classManagementService.getGroupByClassId(this.data[0].classUniqId).subscribe(res => {
      this.group = res.filter(g => g.groupUniqId !== NULL_UUID)
    });
  }

  destroyModal(isOk: boolean): void {
    if (isOk) {
        const isNew: boolean = !this.selectedGroup;
        if (isNew) {
          this._classManagementService.createNewGroup({
            titleEnglish: this.inputtedGroupEnglish,
            titleChinese: this.inputtedGroupChinese,
            id: this.data[0].classUniqId
          }).subscribe((res: any) => {
            this.selectedGroup = res;
            this.modal.destroy({isSubmit: isOk, selectedGroup: this.selectedGroup, isNew: isNew});
          })
        } else {
          this.modal.destroy({isSubmit: isOk, selectedGroup: this.selectedGroup, isNew: isNew});
        }
    } else {
      this.modal.destroy({isSubmit: isOk});
    }
  }
}
