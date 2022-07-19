import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { Observable } from 'rxjs';
import { INTERPRETATION } from 'src/app/@core/constants';
import { LearningActivityService } from 'src/app/@core/services/learning-activity.service';
import { QuestionBankService } from 'src/app/@core/services/question-bank.service';

@Component({
  selector: 'app-select-question',
  templateUrl: './select-question.component.html',
  styleUrls: ['./select-question.component.scss']
})
export class SelectQuestionComponent implements OnInit {
  list: Array<TransferItem & {
    learningActivityUniqueId: string | undefined;
    answers: any;
    type: string;
    interpretations: [];
    score: number | 0;
    needReview: boolean | false;
    titleEnglish: string | undefined;
    titleChinese: string | undefined;
  }> = [];
  taskList$: Observable<any>;
  workplanData = [];
  visualInspectionData = [];
  learningActivityList$: Observable<any>;
  questionList: any = [];
  selectedQuestions = [];
  interpretation = INTERPRETATION;
  public form!: FormGroup;
  selectedTask: any;
  selectedLA: any;
  constructor(
    private modal: NzModalRef,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    private learningActivityService: LearningActivityService
  ) {
    this.getTask();
  }

  ngOnInit(): void {
    this.workplanData = Array(24).fill(0).map((x, i) => {
      return {
        order: i + 1
      }
    });
    this.getData();
  }

  getTask() {
    this.taskList$ = this.questionBankService.getTask();
    this.taskList$.subscribe(res => { console.log(res) })
  }
  destroyModal(isOk: boolean): void {
    if (isOk) {
      this.modal.destroy({ isSubmit: isOk, selectedQuestions: this.selectedQuestions });
    } else {
      this.modal.destroy({ isSubmit: isOk });
    }
  }

  getData(): void {
    const ret: Array<TransferItem & {
      learningActivityUniqueId: string,
      answers: any;
      type: string;
      interpretations: any;
      score: number | 0;
      needReview: boolean | false;
      titleEnglish: string | undefined;
      titleChinese: string | undefined;
    }> = [];
    const resp = this.questionList;
    resp.forEach(element => {
      console.log(element)
      ret.push({
        key: element.learningActivityUniqueId,
        learningActivityUniqueId: element.learningActivityUniqueId,
        title: element.titleChinese,
        answers: element.answers,
        type: element.type,
        interpretations: element.interpretations,
        score: element.score,
        needReview: element.needReview,
        titleEnglish: element.titleEnglish,
        titleChinese: element.titleChinese,
      });
    });
    this.list = ret;
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: any): void {
    if (ret.from === 'left') {
      ret.list.forEach((item) => {
        this.selectedQuestions.push(item)
      })
    }
    if (ret.from === 'right') {
      this.selectedQuestions = this.selectedQuestions.filter( function( el ) {
        return ret.list.indexOf( el ) < 0;
      } );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOption(inputValue: string, item: any): boolean {
    return item.titleEnglish.indexOf(inputValue) > -1 || item.titleChinese.indexOf(inputValue) > -1;
  }

  convertSymbolToBlank(title: string) {
    return title?.replace((/\[#]/gi), '___');
  }

  taskChange() {
    this.learningActivityList$ = this.learningActivityService.getLearningActivityByTask(this.selectedTask)
    this.selectedLA = null;
    this.list = [];
  }
  LAChange() {
    this.list = [];
    this.learningActivityService.getQuestionsByLearningActivity(this.selectedLA).subscribe(questions => {
      this.questionList = questions.questions;
    }).add(() => {
      this.getData();
    });
  }
}
