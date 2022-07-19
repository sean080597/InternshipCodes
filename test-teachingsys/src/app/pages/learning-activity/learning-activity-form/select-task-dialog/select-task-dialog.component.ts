import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { QuestionBankService } from 'src/app/@core/services/question-bank.service';
import { LearningActivityService } from 'src/app/@core/services/learning-activity.service';
import { CommonService } from '@app/@core/services/common.service';

@Component({
  selector: 'app-select-task-dialog',
  templateUrl: './select-task-dialog.component.html',
  styleUrls: ['./select-task-dialog.component.scss']
})
export class SelectTaskDialogComponent implements OnInit {
  taskList$: Observable<any>;
  @Input() type: any = null;
  selectedTask: any = null;
  inputtedTaskEnglish: any = null;
  inputtedTaskChinese: any = null;
  inputtedDescriptionEnglish: any = null;
  inputtedDescriptionChinese: any = null;
  isAgreed: boolean = false;
  learningActivityStore: any = {};
  disabled = false;
  constructor(
    private questionBankService: QuestionBankService,
    private modal: NzModalRef,
    private msg: NzMessageService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private learningActivityService: LearningActivityService
  ) {
    this.learningActivityStore = this.commonService.getLearningActivityDataLocal();
  }
  
  ngOnInit(): void {
      if (this.learningActivityStore.generalInformation?.taskId) {
        this.learningActivityService.getTaskByID(this.learningActivityStore.generalInformation.taskId).subscribe(res => {
          this.selectedTask = res.taskUniqId
        })
      }
    this.disabled = this.type === 'QB' || this.type === 'LAL';
    this.taskList$ = this.questionBankService.getTask();
  }
  destroyModal(isOk: boolean): void {
    if (isOk) {
      if (!this.selectedTask && !this.inputtedTaskChinese && !this.inputtedTaskEnglish && this.type === 'LA') {
        this.msg.error(this.translateService.instant('err_missing_input_task'));
      } else {
        const isNew: boolean = !this.selectedTask;
        if (isNew) {
          this.learningActivityService.addNewTask({
            titleEnglish: this.inputtedTaskEnglish,
            titleChinese: this.inputtedTaskChinese,
            descriptionEnglish: this.inputtedDescriptionEnglish,
            descriptionChinese: this.inputtedDescriptionChinese,
          }).subscribe(res => {
            this.selectedTask = res.data;
            this.modal.destroy({isSubmit: isOk, selectedTask: this.selectedTask, isNew: isNew, isAddQB: this.isAgreed});
          })
        } else {
          this.modal.destroy({isSubmit: isOk, selectedTask: this.selectedTask, isNew: isNew, isAddQB: this.isAgreed});
        }
      }
    } else {
      this.modal.destroy({isSubmit: isOk});
    }
  }
}
