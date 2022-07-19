import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@app/@core/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
  @Input() studentList: any;
  @Input() teacherList: any;
  @Input() currentClass: any;
  @Input() selectedTeachers = [];
  @Input() isAddClass: boolean = true;
  list: TransferItem[] = [];
  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];
  disabled = false;
  showSearch = true;
  selectedStudent = [];
  currentLang = localStorage.getItem('language');
  tableFields = [
    {
      header: this.translate.instant('tbl.id'),
      fieldName: 'studentNo',
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
      fieldName: 'creationTime',
    },
  ]
  form: FormGroup;
  listOfSelectedValue = [];
  defaultOption = [];
  constructor(
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private modal: NzModalRef,
    private commonService: CommonService
  ) {
  }
  ngOnInit(): void {
    this.teacherList = this.teacherList?.data.map(t => {
      return {
        id: t.id,
        fullNameChinese: t.userNameChi,
        fullNameEnglish: t.userNameEng
      }
    })
    this.listOfSelectedValue = this.selectedTeachers;
    this.defaultOption = this.teacherList.concat(this.listOfSelectedValue) || [];
    this.form = this._formBuilder.group({
      titleChinese: [this.currentClass?.titleChinese || ''],
      titleEnglish: [this.currentClass?.titleEnglish || ''],
      assignedTeacher: [this.defaultOption, Validators.required]
    }); 
    if (this.isAddClass) {
      this.form.controls['titleChinese'].setValidators(Validators.required);
      this.form.controls['titleEnglish'].setValidators(Validators.required);
      this.form.updateValueAndValidity();
    }
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
      this.modal.destroy({ isSubmit: isOk, selectedStudent: this.selectedStudent, selectedTeachers: this.form.value.assignedTeacher,titleChinese: this.form.value.titleChinese, titleEnglish: this.form.value.titleEnglish });
    } else {
      this.modal.destroy({ isSubmit: isOk, selectedStudent: null,selectedTeachers: null, className: null});
    }
  }
}
