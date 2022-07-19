
import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild, ViewEncapsulation, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { ACCEPTED_FILETYPE_UPLOAD, INTERPRETATION } from 'src/app/@core/constants';

import { QuestionBanks } from 'src/app/@core/models/question-bank';
import { CommonService } from 'src/app/@core/services/common.service';
import { SelectQuestionComponent } from '../select-question/select-question.component';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';


@Component({
  selector: 'app-add-questions',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  @Input() triggerSubmit = false;
  @Input() dataInitial: any = {};
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  public form!: FormGroup;
  private unsubscribe = new Subject<void>();
  public remainingScore = 0;
  interpretation = INTERPRETATION;
  learningActivitySubmittedData: any = {};
  inputChineseValue: any = [];
  inputEnglishValue: any = [];
  blankData: any = {};
  currentLang = '';
  LAtitle = '';
  workplanData: any = [];
  visualInspectionData: any = [];
  questionSelectedFromQB: any;

  fileList: any = {};
  uploadAttachmentUrl = environment.apiUrl + '/app/attachment';
  ACCEPTED_FILETYPE_UPLOAD = ACCEPTED_FILETYPE_UPLOAD;
  constructor(
    private formBuilder: FormBuilder,
    private msg: NzMessageService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private modalService: NzModalService,
  ) {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.learningActivitySubmittedData = this.commonService.getLearningActivityDataLocal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    // if (changes && changes['dataInitial']) {
    //   this.initForm();
    // }
    if (changes && changes['triggerSubmit']?.currentValue) {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        const isValidOptions = this.validateOptionsBlanks();
        const emitData: any = { formData: this.formDataToObject(this.form.value), triggerFlag: false, isValid: this.remainingScore == 0, isDirty: this.form.dirty };
        if(this.remainingScore != 0) {
          emitData.invalidErr = 'remaining_score_err';
        }
        if (isValidOptions) {
          this.onSubmit.emit(emitData);
        }
      } else {
        this.handleInvalidForm();
      }
    }
  }

  ngOnInit(): void {
    this.workplanData = Array(24).fill(0).map((x,i)=>{
      return {
        order: i + 1
      }
    }); 
    this.visualInspectionData = Array(12).fill(0).map((x,i)=>{
      return {
        order: i + 1
      }
    }); 
    
    this.LAtitle = this.currentLang === 'zh' ? this.learningActivitySubmittedData.generalInformation.titleChinese : (this.learningActivitySubmittedData.generalInformation.titleEnglish || this.translateService.instant('empty_title'));
    this.initForm();
    this.form.valueChanges.subscribe(x => {
      const emitData = Object.assign({}, this.form.value);
      if (this.form.invalid) {
        for (let i = 0; i < this.questions().length; i++) {
          if(this.questions().at(i).invalid) {
            emitData.questions = emitData.questions.filter((e, index) => index != i)
          }
        }
      }
      const isValid = (this.remainingScore == 0) && this.form.valid;
      this.onChange.emit({ formData: this.formDataToObject(emitData), triggerFlag: false, isValid: isValid, isDirty: this.form.dirty });
    })
  }
  convertFileObjArray(fileList) {
    return fileList = fileList.map(file => {
      return {...file, uuid: file.id !== undefined ? file.id : file.response?.id, name: file.fileName !== undefined ? file.fileName : file.response?.fileName}
    });
  }
  initForm() {
    this.dataInitial = this.commonService.getLearningActivityDataLocal().questions;
    this.form = this.formBuilder.group({
      totalScore: [this.dataInitial.totalScore],
      questions: this.formBuilder.array([]),
    });
    this.questions().setValidators(Validators.required);
    if (this.dataInitial.learingActivityQuestions !== undefined) {
      let question = this.form.get('questions') as FormArray;
      this.dataInitial.learingActivityQuestions?.forEach((q, i) => {
        this.fileList['question'+i] = q.fileList !== undefined ? this.convertFileObjArray(q.fileList) : [];
        question.push(this.formBuilder.group({
          titleChinese: [q.titleChinese, Validators.required],
          titleEnglish: q.titleEnglish,
          score: [q.score, [Validators.required, Validators.min(1)]],
          type: q.type,
          needReview: q.needReview,
          options: this.formBuilder.array([]),
          blanks: this.formBuilder.array([]),
        }))
        if (q.type === 'MultipleChoice') {
          q.learingActivityQuestionAnswers.forEach((a) => {
            this.questionOption(i).push(this.formBuilder.group({
              answerChinese: [a.answerChinese, Validators.required],
              answerEnglish: a.answerEnglish,
              isCorrect: a.isCorrect,
            }));
          })
        }
        if (q.type === 'FillIn') {
          q.learingActivityQuestionAnswers.forEach((a) => {
            const ans = {
              answerChinese: a.answerChinese.split(','),
              answerEnglish: a.answerEnglish.split(','),
            }
            this.questionBlank(i).push(this.formBuilder.group({
              answerChinese: [[ans.answerChinese], Validators.required],
              answerEnglish: [ans.answerEnglish],
            }));
          })
        }
      })
      this.onTotalScoreChange();
    } else {
      this.addQuestion();
    }
  }
  onTotalScoreChange() {
    const questionScore = this.form.value.questions.map((e) =>  e.score);
    this.remainingScore = (this.form.value.totalScore ? this.form.value.totalScore : 0) - (questionScore.length > 1 ? questionScore.reduce((acc, cur) => acc + cur) : 0);
    for(let i = 0; i < questionScore.length; i++) {
      this.validateScore(i);
    }
  }
  validateScore(questionIndex) {
    const originScore = this.questions().at(questionIndex).get('score').value;
    if (originScore && !this.commonService.isInt(originScore)) {
      this.questions().at(questionIndex).get('score').setValue(parseFloat(originScore).toFixed(1));
    }
    const questionScore = this.form.value.questions.map((e) => parseFloat(e.score));
    this.remainingScore = this.form.value.totalScore - (questionScore.length > 1 ? questionScore.reduce((acc, cur) => acc + cur) : questionScore[0]);
    this.remainingScore = !this.commonService.isInt(this.remainingScore) ? parseFloat(this.remainingScore.toFixed(1)) : this.remainingScore;
    const isValid = this.remainingScore == 0 && this.form.valid;
    this.onChange.emit({ formData: this.formDataToObject(this.form.value), triggerFlag: false, isValid: isValid, isDirty: this.form.dirty });
  }
  ngAfterViewInit(): void {
    this.commonService.subject.pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.currentLang = res;
      this.LAtitle = this.currentLang === 'zh' ? this.learningActivitySubmittedData.generalInformation.titleChinese : (this.learningActivitySubmittedData.generalInformation.titleEnglish || this.translateService.instant('empty_title'));
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  clearInput(controlName: string) {
    this.form.controls[controlName].setValue(null);
    this.form.controls[controlName].markAsUntouched();
    this.form.controls[controlName].markAsPristine();
    this.form.controls[controlName].updateValueAndValidity();
  }

  // ------------------ Question action START ------------------
  questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }
  newQuestion(initData = null, indexForInit = null): FormGroup {	
    return this.formBuilder.group({
      titleChinese: [initData?.titleChinese || '', Validators.required],	
      titleEnglish: initData?.titleEnglish || '',	
      score: [initData?.score || 0, [Validators.required, Validators.min(1)]],
      type: initData?.type || 'MultipleChoice',	
      needReview: initData?.needReview || false,	
      options: this.formBuilder.array([]),	
      blanks: this.formBuilder.array([]),	
    });	
  }
  addQuestion() {
    this.questions().push(this.newQuestion());
  }
  removeQuestion(questionIndex: number) {
    this.questions().removeAt(questionIndex);
    this.onTotalScoreChange()
  }
  duplicateQuestion(questionIndex: number) {
    if (this.fileList['question'+questionIndex]?.length > 0) {
      const nextIndex = questionIndex + 1;
      this.fileList['question'+nextIndex] = this.fileList['question'+questionIndex];
    }
    this.questions().push(this.newQuestion(this.questions().at(questionIndex).value, questionIndex));	
    if (this.questions().at(questionIndex).value.type === 'MultipleChoice') {	
      this.questions().at(questionIndex).value.options.forEach((a) => {	
        this.questionOption(questionIndex + 1).push(this.formBuilder.group({	
          answerChinese: [a.answerChinese, Validators.required],	
          answerEnglish: [a.answerEnglish],	
          isCorrect: a.isCorrect,	
        }));	
      })	
    }	
    if (this.questions().at(questionIndex).value.type === 'FillIn') {	
      this.questions().at(questionIndex).value.blanks.forEach((a, i) => {	
        this.questionBlank(questionIndex + 1).push(this.formBuilder.group({	
          answerChinese: [a.answerChinese, Validators.required],	
          answerEnglish: [a.answerEnglish],	
        }));	
      });	
    }	
    this.onTotalScoreChange()	
  }
  // ------------------ Question action END ------------------

  // ------------------ Question Option action START ------------------
  questionOption(questionIndex: number): FormArray {
    return this.questions()
      .at(questionIndex)
      .get('options') as FormArray;
  }
  newOption(initData = null): FormGroup {	
    return this.formBuilder.group({	
      answerChinese: [initData?.answerChinese || '', Validators.required],	
      answerEnglish: initData?.answerEnglish || '',	
      isCorrect: initData?.isCorrect || false,	
    });	
  }
  addQuestionOption(questionIndex: number) {
    this.questionOption(questionIndex).push(this.newOption());
  }
  removeQuestionOption(questionIndex: number, optionIndex: number) {
    this.questionOption(questionIndex).removeAt(optionIndex);
  }
  // ------------------ Question Option action END ------------------

  // ------------------ Question Blank action START ------------------
  questionBlank(questionIndex: number): FormArray {
    return this.questions()
      .at(questionIndex)
      .get('blanks') as FormArray;
  }
  newBlank(): FormGroup {
    return this.formBuilder.group({
      answerChinese: [[], Validators.required],
      answerEnglish: []
    });
  }
  addQuestionBlank(questionIndex: number) {
    this.questionBlank(questionIndex).push(this.newBlank());
  }
  filterBlank(e: any, questionIndex: number) {
    const string = e.target.value;
    const numberOfBlanks = (string.match(/[[#]]/gi) || []).length;
    if (numberOfBlanks > 0) {
      const calculated = numberOfBlanks - this.questionBlank(questionIndex).controls.length;
      if (calculated > 0) {
        for (let i = 0; i < calculated; i++) {
          this.addQuestionBlank(questionIndex);
        }
      }
    }
  }

  handleClose(removedTag = {}, questionIndex: number, blankIndex: number, isChinese: boolean): void {
    if (isChinese) {
      this.blankData['question' + questionIndex][blankIndex].chinese= this.blankData['question' + questionIndex][blankIndex].chinese.filter((tag: any) => tag !== removedTag);
      this.questionBlank(questionIndex).controls[blankIndex].get('answerChinese')?.setValue(this.blankData['question' + questionIndex][blankIndex]);
    } else {
      this.blankData['question' + questionIndex][blankIndex].english= this.blankData['question' + questionIndex][blankIndex].english.filter((tag: any) => tag !== removedTag);
      this.questionBlank(questionIndex).controls[blankIndex].get('answerEnglish')?.setValue(this.blankData['question' + questionIndex][blankIndex]);
    }
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 10;
    return isLongTag ? `${tag.slice(0, 10)}...` : tag;
  }

  handleInputConfirm(questionIndex: number, blankIndex: number, isChinese: boolean): void {
    if (this.blankData['question' + questionIndex] === undefined) {
      this.blankData['question' + questionIndex] = [];
    }
    if (this.blankData['question' + questionIndex][blankIndex] === undefined) {
      this.blankData['question' + questionIndex][blankIndex] = {
        chinese: [],
        english: [],
      };
    }
    if (isChinese) {
      if (this.inputChineseValue[blankIndex] !== undefined && this.inputChineseValue[blankIndex] && this.inputChineseValue[blankIndex].trim() != '') {
        this.blankData['question' + questionIndex][blankIndex].chinese.push(this.inputChineseValue[blankIndex]);
      } 
      this.questionBlank(questionIndex).controls[blankIndex].get('answerChinese')?.setValue(this.blankData['question' + questionIndex][blankIndex].chinese);
      this.inputChineseValue[blankIndex] = null;
    } else {
      if (this.inputEnglishValue[blankIndex] != undefined && this.inputEnglishValue[blankIndex] && this.inputEnglishValue[blankIndex].trim() != '') {
        this.blankData['question' + questionIndex][blankIndex].english.push(this.inputEnglishValue[blankIndex]);
      }
      this.questionBlank(questionIndex).controls[blankIndex].get('answerEnglish')?.setValue(this.blankData['question' + questionIndex][blankIndex].english);
      this.inputEnglishValue[blankIndex] = null;
    }
  }
  // ------------------ Question Blank action END ------------------

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  typeChange(e: any, questionIndex: number) {
    this.questions().at(questionIndex).get('titleChinese')?.setValue('');
    this.questions().at(questionIndex).get('titleEnglish')?.setValue('');
    this.clearFormArray(this.questions().at(questionIndex).get('options') as FormArray);
    this.clearFormArray(this.questions().at(questionIndex).get('blanks') as FormArray);
  }

  formDataToObject(formData: any) {
    let object: QuestionBanks;
    const questions = formData.questions.map((question: any, index: number) => {
      const attachmentIds = this.fileList['question'+index]?.map((items: any) => {
        return items.id !== undefined ? items.id : items.response?.id;
      });
      const obj: any = {
        attachmentIds: attachmentIds || [],
        fileList: this.fileList['question'+index],
        learningActivityUniqueId: this.learningActivitySubmittedData.generalInformation.learningActivityId,
        score: question.score,
        needReview: question.needReview,
        titleEnglish: question.titleEnglish,
        titleChinese: question.titleChinese,
        type: question.type,
        learingActivityQuestionAnswers: question.type === 'MultipleChoice' ? this.mappingAnswer(question.options) : this.mappingAnswer(question.blanks)
      }
      if (question.type === 'VisualInspectionTable') {
        obj.interpretations = this.interpretation.filter(n => n);
      }
      return obj;
    });
    object = {
      learningActivityUniqueId: this.learningActivitySubmittedData.generalInformation.learningActivityId,
      learingActivityQuestions: questions,
      totalScore: this.form.value.totalScore
    }
    return object
  }

  mappingAnswer(answerList: any) {
    return answerList?.map((i: any) => {
      return {
        answerEnglish: (typeof i?.answerEnglish !== 'string') ? (i?.answerEnglish ? i?.answerEnglish.toString() : '') : i?.answerEnglish,
        answerChinese: (typeof i?.answerChinese !== 'string') ? (i?.answerChinese ? i?.answerChinese.toString() : '') : i?.answerChinese,
        isCorrect: (typeof i?.answerEnglish !== 'string') ? true : i.isCorrect
      }
    })
  }
  
  handleInvalidForm() {
    for (let i = 0; i < this.questions().length; i++) {
      if (this.questions().at(i).get('titleChinese').invalid && this.questions().at(i).get('titleChinese').errors['required']) {
        this.questions().at(i).get('titleChinese').markAsDirty({ onlySelf: true });
        this.questions().at(i).get('titleChinese').updateValueAndValidity({ onlySelf: true });
      }
      if (this.questions().at(i).get('score').invalid && (this.questions().at(i).get('score').errors['min'] || this.questions().at(i).get('score').errors['required'])) {
        this.questions().at(i).get('score').markAsDirty({ onlySelf: true });
        this.questions().at(i).get('score').updateValueAndValidity({ onlySelf: true });
      }
      if (this.questions().at(i).get('score').invalid && (this.questions().at(i).get('score').errors['min'] || this.questions().at(i).get('score').errors['required'])) {
        this.questions().at(i).get('score').markAsDirty({ onlySelf: true });
        this.questions().at(i).get('score').updateValueAndValidity({ onlySelf: true });
      }
    }
    this.onSubmit.emit({ formData: this.formDataToObject(this.form.value), triggerFlag: false, isValid: false });
  }

  addRecord(e, index: number) {
    this.interpretation[index] = e.target.value;
  }

  addFromQuestionBank() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('select_question_from_question_bank'),
      nzWidth: '1800px',
      nzContent: SelectQuestionComponent
    });

    modal.afterClose.subscribe(result => {
      this.questionSelectedFromQB = result?.selectedQuestions;
      const beginIndex = this.form.value.questions.length;
      for (let i = 0; i < result?.selectedQuestions?.length; i++) {
        this.questions().push(this.formBuilder.group({
          titleChinese: [result.selectedQuestions[i].titleChinese, Validators.required],
          titleEnglish: result.selectedQuestions[i].titleEnglish,
          score: result.selectedQuestions[i].score,
          type: result.selectedQuestions[i].type,
          needReview: result.selectedQuestions[i].needReview || false,
          options: this.formBuilder.array([]),
          blanks: this.formBuilder.array([]),
        }))
        if (result.selectedQuestions[i].type === 'MultipleChoice') {
          result.selectedQuestions[i].answers.forEach(answer => {
            this.questionOption(beginIndex+i).push(this.formBuilder.group({
              answerChinese: [answer.answerChinese, Validators.required],
              answerEnglish: answer.answerEnglish,
              isCorrect: answer.isCorrect,
            }))
          });
        }
        if (result.selectedQuestions[i].type === 'FillIn') {
          result.selectedQuestions[i].answers.forEach(answer => {
            this.questionBlank(beginIndex + i).push(this.formBuilder.group({	
              answerChinese: [answer.answerChi.split(','), Validators.required],	
              answerEnglish: [answer.answerEng.split(',')]
            }))
          });
        }
        if (result.selectedQuestions[i].type === 'VisualInspectionTable') {
          this.interpretation = result.selectedQuestions[i].interpretations;
        }
      }
      this.onTotalScoreChange()
    });
  }

  handleFileChange({ file, fileList }: NzUploadChangeParam, questionIndex: number): void {
    const status = file.status;
    if (status !== 'uploading') {
      this.fileList['question'+questionIndex] = fileList;
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`, {
        nzDuration: 1000
      });
    }
  }

  validateOptionsBlanks() {
    let res: boolean = true;
    this.form.value.questions.forEach((question, index) => {
      if (question.type === 'MultipleChoice') {
        if (question.options == undefined || question.options.length < 1){
          this.msg.error(this.translateService.instant('err_at_least_one_option', {
            field: this.translateService.instant('questions')+ ' ' + (Number(index)+1),
          }), { nzDuration: 1000 });
          this.onSubmit.emit({ formData: this.formDataToObject(this.form.value), triggerFlag: false, isValid: false });
          res = false;
          return;
        }
      }
      res = true
    })
    return res;
  }
  beforeUpload = (file: NzUploadFile, questionIndex): boolean => {
    // Judgment on the upload file type
    const type = file.type;
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
    if (this.fileList['question'+questionIndex]?.length == 3) {
      this.msg.error(this.translateService.instant('unable_to_upload'), {
        nzDuration: 1000
      });
      return false;
    }
    this.fileList['question'+questionIndex] = this.fileList['question'+questionIndex] ? this.fileList['question'+questionIndex] : [];
    this.fileList['question'+questionIndex] = this.fileList['question'+questionIndex].concat(file);
    // When the type and size meet the requirements, upload directly; if return false, then you need to call the upload method manually
    return true;
  }
}
