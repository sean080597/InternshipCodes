import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LearningActivityService } from 'src/app/@core/services/learning-activity.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { TriggerSubmitFlag } from 'src/app/@core/interfaces';
import { CommonService } from 'src/app/@core/services/common.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NotificationService } from 'src/app/@core/services/notification.service';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SelectTaskDialogComponent } from './select-task-dialog/select-task-dialog.component';
import { QuestionBankService } from '@app/@core/services/question-bank.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-learning-activity-form',
  templateUrl: './learning-activity-form.component.html',
  styleUrls: ['./learning-activity-form.component.scss'],
})
export class LearningActivityFormComponent implements OnInit {
  private unsubscribe = new Subject<void>();
  index = 0;
  public form!: FormGroup;
  triggerGetDataFromId: boolean = true;
  triggerSubmitFlag: TriggerSubmitFlag = {
    generalInfo: false,
    questions: false,
    preview: false,
  };
  learningActivitySubmittedData: any = {
    generalInformation: {}
  };
  isSave = false;
  isBack = false;
  disabledSave = true;
  fileList = [];
  learningActivityId: string;
  questionField: { learingActivityQuestions: any[]; learningActivityUniqueId: any; learningActivityId: any; };
  totalScore: any;
  type = 'LA';
  taskId = '';
  constructor(
    private learningActivity: LearningActivityService,
    private questionBankService: QuestionBankService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private commonService: CommonService,
    private msg: NzMessageService,
    private router: Router,
    private modalService: NzModalService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    localStorage.removeItem('currentLA');
    this.learningActivityId = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.queryParamMap.get('type') || 'LA';
  }

  ngOnInit(): void {
    this.getLearningActivityData();
    this.initTriggerSubmitFlag();
  }

  initTriggerSubmitFlag() {
    this.triggerSubmitFlag = {
      generalInfo: false,
      questions: false,
      preview: false,
    };
  }
  prepareDataForEditForm(res) {
    this.taskId = this.type === 'LA' ? res.data.taskId : res.data.taskUniqueId;
    this.learningActivitySubmittedData.generalInformation = {
      taskId: this.taskId || null,
      learningActivityId: res.data.uniqId,
      titleChinese: res.data.titleChinese,
      titleEnglish: res.data.titleEnglish,
      descriptionChinese: res.data.descriptionChinese,
      descriptionEnglish: res.data.descriptionEnglish,
      fileList: res.data.attachments ? res.data.attachments : []
    };
    res.data.questions.forEach(q => {
      if (q.interpretations?.length > 0) {
        for (let i = 0; i < 12; i++) {
          if (q.interpretations[i] === undefined) {
            q.interpretations.push('');
          }
        }
      }
    })
    // console.log(res.data);
    const questions = [];
    for (let q in res.data.questions) {
      questions.push({
        fileList: res.data.questions[q].attachments,
        score: res.data.questions[q].score,
        learningActivityUniqueId: res.data.questions[q].uniqId,
        interpretations: res.data.questions[q].interpretations,
        needReview: res.data.questions[q].needReview || false,
        titleChinese: res.data.questions[q].titleChinese,
        titleEnglish: res.data.questions[q].titleEnglish,
        type: res.data.questions[q].type,
      });
      const answers = [];
      for (let a in res.data.questions[q].answers) {
        answers.push({
          answerChinese: res.data.questions[q].answers[a].answerChinese,
          answerEnglish: res.data.questions[q].answers[a].answerEnglish,
          isCorrect: res.data.questions[q].answers[a].isCorrect,
        })
      }
      questions[q].learingActivityQuestionAnswers = answers;
    };
    this.fileList = res.data.attachments;
    this.disabledSave = false;
    this.learningActivitySubmittedData.questions = { totalScore: res.data.totalScore, learingActivityQuestions: questions, learningActivityUniqueId: res.data.uniqId, learningActivityId: res.data.uniqId };
    this.commonService.storeLearningActivityData({ generalInformation: this.learningActivitySubmittedData.generalInformation });
    this.commonService.storeLearningActivityData({ ...this.learningActivitySubmittedData, questions: this.learningActivitySubmittedData.questions });
  }
  getLearningActivityData() {
    if (this.learningActivityId) {
      if (this.type === 'QB') {
        this.questionBankService.getLearningActivityByID(this.learningActivityId).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
          this.prepareDataForEditForm(res);
        })
      }
      if (this.type === 'LA') {
        this.learningActivity.getLearningActivityByID(this.learningActivityId).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
          this.prepareDataForEditForm(res);
        })
      }
    }
  }

  onIndexChange(index: number): void {
    if (index < this.index) {
      this.onBack(index);
    } else {
      this.triggerSubmit(index);
    }
  }
  triggerSubmit(index: number) {
    this.isBack = false;
    this.initTriggerSubmitFlag();
    this.triggerSubmitFlag = {
      generalInfo: index - 1 === 0,
      questions: index - 1 === 1,
      preview: index - 1 === 2
    };
    if (index === 3) {
      // edit question bank flow
      if (this.learningActivityId && this.type === 'QB') {
        this.saveQuestionBank();
      } else {
        this.onSave();
      }
    }
    this.cdr.markForCheck()
  }
  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }
  convertFileObjArray(fileList) {
    return fileList = fileList.map(file => {
      return { ...file, uuid: file.id !== undefined ? file.id : file.response?.id, name: file.fileName !== undefined ? file.fileName : file.response?.fileName }
    });
  }
  submitGeneralInfo(e: any): void {
    this.triggerSubmitFlag.generalInfo = e.triggerFlag;
    this.cdr.markForCheck();
    if (e.isValid) {
      if (this.learningActivityId) e.isDirty = true;
      if (e.isDirty) {
        if (e.formData.fileList) {
          e.formData.attachmentIds = e.formData.fileList.map((items: any) => {
            return items.id !== undefined ? items.id : items.response?.id;
          });
        }
        else {
          e.formData.attachmentIds = [];
        }
        if (this.learningActivityId && this.type === 'LA') {
          e.formData.id = this.learningActivityId;
          e.formData.taskId = this.taskId;
          e.formData.fileList = this.convertFileObjArray(e.formData.fileList);
          console.log(e.formData);
          this.updateLearningActivity(e.formData);

        } else if (!this.learningActivityId) {
          e.formData.fileList = e.formData.fileList = this.convertFileObjArray(e.formData.fileList);
          console.log(e.formData);
          this.createLearningActivity(e.formData)
        }
        else {
          this.commonService.storeLearningActivityData({ questions: this.learningActivitySubmittedData.questions, generalInformation: { ...e.formData, learningActivityId: this.learningActivityId, taskId: this.taskId } });
          this.handleAfterSaved();
        }
      }
      else {
        this.handleAfterSaved();
      }
    }
  }

  submitQuestion(e: any) {
    this.triggerSubmitFlag.questions = e.triggerFlag;
    if (this.learningActivityId) e.isDirty = true;
    if (e.isValid) {
      if (e.isDirty) {
        if (this.type === 'LA') {
          this.commonService.showLoading();
          this.learningActivity
            .saveQuestion(e.formData)
            .subscribe({
              next: (v) => {
                if (v.succeeded) {
                  this.commonService.storeLearningActivityData({ ...this.learningActivitySubmittedData, questions: { ...e.formData, learningActivityId: v.data } })
                  this.msg.success(
                    this.translateService.instant('data_saved', {
                      field: this.translateService.instant('questions'),
                    })
                  );
                }
                this.commonService.hideLoading();
                this.handleAfterSaved();
              },
              error: (e) => {
                this.notificationService.showError(e)
              },
              complete: () => console.info('complete')
            });
        }
        else {
          this.commonService.storeLearningActivityData({ ...this.learningActivitySubmittedData, questions: { ...e.formData, learningActivityId: this.learningActivityId, totalScore: e.formData.totalScore } });
          this.handleAfterSaved();
        }
      } else {
        this.handleAfterSaved();
      }
    } else {
      if (e.invalidErr !== undefined) {
        this.msg.error(
          this.translateService.instant(e.invalidErr)
        );
      }
    }
  }
  saveQuestionBank() {
    const questions = [];
    for (let q in this.learningActivitySubmittedData.questions.learingActivityQuestions) {
      questions.push({
        titleChinese: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].titleChinese,
        titleEnglish: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].titleEnglish,
        type: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].type,
        interpretations: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].interpretations,
        score: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].score,
        needReview: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].needReview,
      });
      const answers = [];
      for (let a in this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers) {
        answers.push({
          answerChinese: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers[a].answerChinese,
          answerEnglish: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers[a].answerEnglish,
          isCorrect: this.learningActivitySubmittedData.questions.learingActivityQuestions[q].learingActivityQuestionAnswers[a].isCorrect,
        })
      }
      questions[q].answers = answers;
    };
    const updateQuestionBankLearningActivityForm = {
      questionBanks: questions,
      // totalScore: this.learningActivitySubmittedData.questions.score,
      questionBankLearningActivityId: this.learningActivityId
    }
    this.questionBankService.updateQuestionBankLearningActivity(updateQuestionBankLearningActivityForm).subscribe(res => {
      if (res.succeeded) {
        this.msg.success(
          this.translateService.instant('data_saved', {
            field: this.translateService.instant('questions'),
          })
        );
        this.router.navigate(['question-bank'])
      }
    })
  }

  updateLearningActivity(formData) {
    this.commonService.showLoading();
    this.learningActivity
      .updateGeneralInformation(formData)
      .subscribe({
        next: (v) => {
          if (v.succeeded) {
            this.commonService.storeLearningActivityData({ generalInformation: { ...formData, learningActivityId: v.data, taskId: this.taskId }, questions: this.learningActivitySubmittedData.questions })
            this.msg.success(
              this.translateService.instant('data_saved', {
                field: this.translateService.instant('general_information'),
              })
            );
          }
          this.commonService.hideLoading();
          this.handleAfterSaved();
        },
        error: (e) => {
          this.notificationService.showError(e)
        },
        complete: () => console.info('complete')
      });
  }
  createLearningActivity(formData) {
    this.commonService.showLoading();
    this.learningActivity
      .saveGeneralInformation(formData)
      .subscribe({
        next: (v) => {
          if (v.succeeded) {
            this.commonService.storeLearningActivityData({ generalInformation: { ...formData, learningActivityId: v.data, taskId: this.taskId } })
            this.msg.success(
              this.translateService.instant('data_saved', {
                field: this.translateService.instant('general_information'),
              })
            );
          }
          this.commonService.hideLoading();
          this.handleAfterSaved();
        },
        error: (e) => {
          this.notificationService.showError(e)
        },
        complete: () => console.info('complete')
      });
  }

  handleAfterSaved() {
    this.learningActivitySubmittedData = this.commonService.getLearningActivityDataLocal();
    if (this.isSave) {
      this.router.navigate(['learning-activity']);
    } else if (this.isBack) {
      this.index = this.index - 1;
      this.isBack = this.disabledSave = false;
    } else {
      this.index = this.index + 1;
      this.disabledSave = this.index != 2;
      if (this.index === 1 && this.learningActivitySubmittedData.questions.learingActivityQuestions?.length > 0) {
        this.disabledSave = false;
      }
    }
    this.isSave = false;
  }

  cancel() {
    if (this.type ==='LA') {
      this.router.navigate(['learning-activity']);
    }
    if (this.type ==='QB') {
      this.router.navigate(['question-bank']);
    }
  }

  onBack(targetIndex: number) {
    this.isBack = true;
    console.log(this.index)
    this.learningActivitySubmittedData = this.commonService.getLearningActivityDataLocal();
    if (targetIndex < this.index && this.index === 1) {
      this.triggerSubmitFlag.questions = true;
      this.cdr.markForCheck()
      // this.index = targetIndex;
    } else {
      this.index = targetIndex
    }
  }

  onSave() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('select_task_to_save'),
      nzWidth: '1000px',
      nzContent: SelectTaskDialogComponent,
      nzComponentParams: {
        type: this.type
      }
    });
    modal.afterClose.subscribe(result => {
      this.isSave = result.isSubmit;
      if (result.isSubmit) {
        if (this.type === 'QB') {
          this.saveQuestionBank();
        } else {
          if (this.index === 0) {
            const formData = {
              isValid: true,
              isDirty: true,
              formData: { ...this.learningActivitySubmittedData?.generalInformation, taskId: result.selectedTask, fileList: this.fileList, IsAddToQuestionBank: result.isAddQB }
            }
            this.submitGeneralInfo(formData);
          }
          if (this.index !== 0) {
            const formData = {
              isValid: true,
              isDirty: true,
              formData: { ...this.learningActivitySubmittedData?.questions, IsAddToQuestionBank: result.isAddQB }
            }
            if (this.index === 1) {
              this.saveQuestion(formData.formData);
            }
            formData.formData.taskId = result.selectedTask;
            this.learningActivity.saveActivityToTask(formData.formData).subscribe(res => {
              if (res) {
                this.router.navigate(['learning-activity']);
                this.msg.success(
                  this.translateService.instant('data_saved', {
                    field: this.translateService.instant('learning_activity'),
                  })
                );
              }
            })
          }
        }
      }
    });
  }

  saveQuestion(formData) {
    this.learningActivity
      .saveQuestion(formData)
      .subscribe({
        next: (v) => {
          this.msg.success(
            this.translateService.instant('data_saved', {
              field: this.translateService.instant('learning_activity'),
            })
          );
        },
        error: (e) => {
          this.notificationService.showError(e)
        },
        complete: () => this.router.navigate(['learning-activity'])
      });
  }

  checkTitleChange(e) {
    this.disabledSave = !e.onTitleChange.titleChinese || !e.onTitleChange.titleEnglish;
    this.learningActivitySubmittedData.generalInformation.titleChinese = e.onTitleChange.titleChinese;
    this.learningActivitySubmittedData.generalInformation.titleEnglish = e.onTitleChange.titleEnglish;
    this.learningActivitySubmittedData.generalInformation.descriptionChinese = e.onTitleChange.descriptionChinese;
    this.learningActivitySubmittedData.generalInformation.descriptionEnglish = e.onTitleChange.descriptionEnglish;
    this.fileList = e.onTitleChange.fileList;
  }
  onQuestionFormChange(e) {
    this.learningActivitySubmittedData.questions = e.formData;
    this.disabledSave = !e.isValid;
  }
}
