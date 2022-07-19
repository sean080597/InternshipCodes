import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonService } from 'src/app/@core/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { GeneralInformationFormFields } from 'src/app/@core/interfaces';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ACCEPTED_FILETYPE_UPLOAD } from 'src/app/@core/constants';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit, OnChanges {
  @Input() triggerSubmit = false;
  @Input() dataInitial: GeneralInformationFormFields = {
    titleChinese: '',
    descriptionChinese: '',
    titleEnglish: '',
    descriptionEnglish: '',
  };
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onChangeTitle: EventEmitter<any> = new EventEmitter();
  public form!: FormGroup;
  fileList: any = [];
  uploadAttachmentUrl = environment.apiUrl + '/app/attachment';
  ACCEPTED_FILETYPE_UPLOAD = ACCEPTED_FILETYPE_UPLOAD;
  constructor(
    private formBuilder: FormBuilder,
    private msg: NzMessageService,
    private translateService: TranslateService,
    private commonService: CommonService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && !_.isEmpty(changes['dataInitial']?.currentValue)) {
      this.dataInitial = changes['dataInitial']?.currentValue;
      this.fileList = changes['dataInitial']?.currentValue.fileList;
      this.fileList = this.fileList.map(file => {
        return {...file, uuid: file.id, name: file.fileName}
      });
      this.initFormData();
    }
    if (changes && changes['triggerSubmit']?.currentValue) {
      if (this.form.valid) {
        this.onSubmit.emit({ formData: { ...this.form.value, fileList: this.fileList}, triggerFlag: false, isValid: true, isDirty: this.form.dirty });
      } else {
        this.handleInvalidForm();
      }
    }
  }

  ngOnInit(): void {
    this.initFormData();
  }
  initFormData() {
    this.form = this.formBuilder.group({
      titleEnglish: [this.dataInitial.titleEnglish, Validators.required],
      titleChinese: [this.dataInitial.titleChinese, Validators.required],
      descriptionEnglish: [this.dataInitial.descriptionEnglish],
      descriptionChinese: [this.dataInitial.descriptionChinese]
    });
  }
  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file?.status;
    if (status !== 'uploading') {
      this.fileList = fileList;
      this.form.markAsDirty();
      this.onTitleChange();
      // this.attachmentIds = fileList.map((items: any) => items.response?.id);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`, {
        nzDuration: 1000
      });
    }
  }

  handleInvalidForm() {
    this.form.markAsTouched();
    Object.values(this.form.controls).forEach(control => {
      if (control.invalid) {
        switch (this.commonService.getFormControlName(control)) {
          case 'titleChinese':
            this.msg.error(this.translateService.instant('err_input_required', { field: '学习活动名称' }));
            break;
          case 'titleEnglish':
            this.msg.error(this.translateService.instant('err_input_required', { field: 'Learning Activity name' }));
            break;
        }
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    this.onSubmit.emit({ formData: { ...this.form.value, fileList: this.fileList }, triggerFlag: false, isValid: false });
  }

  clearInput(controlName: string) {
    this.form.controls[controlName].setValue(null);
    this.form.controls[controlName].markAsUntouched();
    this.form.controls[controlName].markAsPristine();
    this.form.controls[controlName].updateValueAndValidity();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // Judgment on the upload file type
    const type = file?.type;
    const str = ACCEPTED_FILETYPE_UPLOAD.split(',');
    if (str.indexOf(type) < 0) {
      this.msg.error(this.translateService.instant('unable_to_upload'), {
        nzDuration: 1000
      });
      return false;
    }
    // Limit on upload file size
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.msg.error(this.translateService.instant('unable_to_upload'), {
        nzDuration: 1000
      });
      return false;
    }
    if (this.fileList?.length == 10) {
      this.msg.error(this.translateService.instant('unable_to_upload'), {
        nzDuration: 1000
      });
      return false;
    }
    this.fileList = this.fileList ? this.fileList : [];
    this.fileList = this.fileList.concat(file);
    // When the type and size meet the requirements, upload directly; if return false, then you need to call the upload method manually
    return true;
  }

  onTitleChange() {
    const titles = {
      titleEnglish: this.form.value.titleChinese,
      titleChinese: this.form.value.titleEnglish,
      descriptionEnglish: this.form.value.descriptionChinese,
      descriptionChinese: this.form.value.descriptionEnglish,
      fileList: this.fileList,
    }
    this.onChangeTitle.emit({onTitleChange: titles});
  }
}
