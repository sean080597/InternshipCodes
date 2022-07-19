import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentWorkpageService } from '@app/@core/services/student-workpage.service';
import { DROPDOWN_STEPS, DROPDOWN_TOOLS, QUESTION_TYPE, WORKPAGE_ACTION } from '@app/@core/constants';
import { ReqQuestion, StudentAssignment, StudentAssignmentQuestion } from '@app/@core/models/student-workpage';
import { finalize, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from "lodash";
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-student-workpage-question',
  templateUrl: './student-workpage-question.component.html',
  styleUrls: ['./student-workpage-question.component.scss']
})
export class StudentWorkpageQuestionComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  studentData: StudentAssignment
  currentIdx = 0;
  questions: StudentAssignmentQuestion[] = []
  questionTemplateList = []
  questionTemplate: TemplateRef<any>
  questionForm: FormGroup
  questionAnswers = []
  dropdownSteps = DROPDOWN_STEPS
  dropdownTools = DROPDOWN_TOOLS

  @ViewChild('MultipleChoice') typeMultipleChoice: TemplateRef<any>;
  @ViewChild('Essay') typeEssay: TemplateRef<any>;
  @ViewChild('FillIn') typeFillIn: TemplateRef<any>;
  @ViewChild('WorkPlanTable') typeWorkPlan: TemplateRef<any>;
  @ViewChild('VisualInspectionTable') typeVisualInspec: TemplateRef<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private studentWorkpageService: StudentWorkpageService,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.questionForm = this.formBuilder.group({
      assignmentId: [''],
      questions: [[]],
    })

    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      this.studentWorkpageService.getAssignmentStudent(params.get('id')).subscribe(res => {
        if (!res || !res.data) this.router.navigate(['/work-page'])
        if (!this.checkAccess(res.data)) this.router.navigate(['/work-page'])

        this.questionForm.patchValue({ assignmentId: res.data.assignmentId })
        this.studentData = res.data
        this.changeContent()
      })
    })
  }

  ngAfterViewInit(): void {
    this.questionTemplateList = [
      { type: QUESTION_TYPE.MULTIPLE_CHOICE, template: this.typeMultipleChoice },
      { type: QUESTION_TYPE.ESSAY, template: this.typeEssay },
      { type: QUESTION_TYPE.FILL_IN, template: this.typeFillIn },
      { type: QUESTION_TYPE.WORK_PLAN_TABLE, template: this.typeWorkPlan },
      { type: QUESTION_TYPE.VISUAL_INSPEC_TABLE, template: this.typeVisualInspec },
    ]
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkAccess(studentData: StudentAssignment) {
    const showBtn = this.studentWorkpageService.genNextAction(studentData.status, studentData.internalStatus, studentData.isPassed)
    return showBtn.action === WORKPAGE_ACTION.STUDENT_START || (showBtn.action === WORKPAGE_ACTION.STUDENT_VIEW_FEEDBACK && !showBtn.disabled)
  }

  get f() {
    return this.questionForm.controls;
  }

  pre(): void {
    this.currentIdx -= 1;
    this.changeContent();
  }

  next(): void {
    this.currentIdx += 1;
    this.changeContent();
  }

  done(): void {
    this.modalService.create({
      nzTitle: this.translateService.instant('workpage_confirmSubmit'),
      nzContent: this.translateService.instant('workpage_confirmSubmitContent'),
      nzWidth: '50%',
      nzCentered: true,
      nzOnOk: () => new Promise(resolve => {
        this.submitForm().pipe(finalize(() => resolve())).subscribe(() => this.router.navigate(['/work-page']))
      })
    })
  }

  submitForm() {
    const clonedData = cloneDeep(this.questionAnswers)
    const mappedData = clonedData.map((t, idx) => {
      return this.questions[idx].type === QUESTION_TYPE.MULTIPLE_CHOICE ? t.map(q => ({ answer: q.checked + '' })) : t
    })

    const formData = cloneDeep(this.questionForm.value)
    formData.questions = formData.questions.map((t, idx) => ({ ...t, studentAnswers: [...mappedData[idx]] }))
    this.questionForm.setValue(formData)

    if (this.currentIdx < this.questions.length) this.studentWorkpageService.submitWorkpagePending(this.questionForm.value)
    return this.studentWorkpageService.submitWorkpageCompleted(this.questionForm.value)
  }

  changeContent(): void {
    this.questions = this.studentData.questions.filter(t => !t.isPassed)
    this.questionTemplate = this.genQuestionRef(this.questions[this.currentIdx]?.type)
    if (this.questionAnswers.length < (this.currentIdx + 1)) {
      this.addQuestionForm(this.questions[this.currentIdx])
    }
  }

  addQuestionForm(question: StudentAssignmentQuestion) {
    // create answers for binding UI
    let answers = []
    switch (question.type) {
      case QUESTION_TYPE.MULTIPLE_CHOICE:
        answers = question.questionAnswers.map(t => ({ label: t.answer, value: t.uniqId, checked: false }))
        break;
      case QUESTION_TYPE.ESSAY:
        answers = [{ "answer": '' }]
        break;
      case QUESTION_TYPE.FILL_IN:
        answers = question.questionAnswers.map(t => ({ "answer": '' }))
        break;
      case QUESTION_TYPE.WORK_PLAN_TABLE:
        answers = Array(24).fill(null).map(() => ({ step: '', tool: '', safetyEnv: '', workingHours: 0, note: '' }))
        break;
      case QUESTION_TYPE.VISUAL_INSPEC_TABLE:
        answers = question.interpretations.map(t => ({ interpretation: t, isAcceptable: true }))
        break;
      default:
        break;
    }
    this.questionAnswers.splice(this.currentIdx, 0, answers)

    // create obj for submitting, then will map questionAnswers to studentAnswers before sending
    const newQuestion: ReqQuestion = { learningActivityQuestionId: question.learningActivityQuestionId, studentAnswers: [], date: new Date() }
    const formData = { ...this.questionForm.value }
    formData.questions.push(newQuestion)
    this.questionForm.setValue(formData)
  }

  genQuestionRef(type: QUESTION_TYPE) {
    if (!type) return null
    return this.questionTemplateList.find(t => t.type === type)?.template
  }

  checkHiddenNextBtn() {
    return (this.currentIdx === (this.questions.length - 1)) || this.questions[this.currentIdx]?.needReview
  }

  addSelectItem(input: HTMLInputElement, type: string) {
    if (type === 'step') {
      if (this.dropdownSteps.indexOf(input.value) === -1) {
        this.dropdownSteps.push(input.value)
      }
    } else {
      if (this.dropdownTools.indexOf(input.value) === -1) {
        this.dropdownTools.push(input.value)
      }
    }
  }
}
