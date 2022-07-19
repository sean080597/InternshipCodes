import {  Component,  Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StudentListComponent } from '../../student-list/student-list.component';
import { TransferChange, TransferItem, TransferSelectChange } from 'ng-zorro-antd/transfer'
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-student-to-group',
  templateUrl: './add-student-to-group.component.html',
  styleUrls: ['./add-student-to-group.component.scss']
})
export class AddStudentToGroupComponent implements OnInit {
  @ViewChild('unChosen') unChosenStudentList: StudentListComponent;
  @ViewChild('chosen') chosenStudentList: StudentListComponent;
  @Input() data: any;
  @Input() studentList: any;

  list: TransferItem[] = [];
  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
  disabled = false;
  showSearch = true;
  selectedStudent = [];
  tableFields = [
    {
      header: this.translate.instant('tbl.id'),
      fieldName: 'id',
    },
    {
      header: this.translate.instant('tbl.chineseName'),
      fieldName: 'fullNameChinese',
    },
    {
      header: this.translate.instant('tbl.englishName'),
      fieldName: 'fullNameEnglish',
    },
    {
      header: this.translate.instant('tbl.email'),
      fieldName: 'email',
    },
    {
      header: this.translate.instant('createdDate'),
      fieldName: 'createdDate',
    },
  ]
  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalRef
  ) {
  }
  ngOnInit(): void {
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: any): void {
    if (ret.from === 'left') {
      ret.list.forEach((item) => {
        this.selectedStudent.push(item)
      })
    }
    if (ret.from === 'right') {
      this.selectedStudent = this.selectedStudent.filter( function( el ) {
        return ret.list.indexOf( el ) < 0;
      } );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOption(inputValue: string, item: any): boolean {
    return item.id?.indexOf(inputValue) > -1 ||
            item.fullNameChinese?.indexOf(inputValue) > -1 ||
            item.fullNameEnglish?.indexOf(inputValue) > -1 ||
            item.email?.indexOf(inputValue) > -1;
  }

  destroyModal(isOk: boolean): void {
    if (isOk) {
      this.modal.destroy({ isSubmit: isOk, selectedStudent: this.selectedStudent });
    } else {
      this.modal.destroy({ isSubmit: isOk, selectedStudent: null });
    }
  }
}
