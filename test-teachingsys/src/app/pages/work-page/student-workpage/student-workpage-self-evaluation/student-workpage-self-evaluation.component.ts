import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentWorkpageService } from '@app/@core/services/student-workpage.service';
import { QUESTION_TYPE, SELF_ASSESSMENT_TYPE, WORKPAGE_ACTION } from '@app/@core/constants';
import { StudentAssignment, StudentAssignmentEvaluation, StudentAssignmentQuestion } from '@app/@core/models/student-workpage';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-workpage-self-evaluation',
  templateUrl: './student-workpage-self-evaluation.component.html',
  styleUrls: ['./student-workpage-self-evaluation.component.scss']
})
export class StudentWorkpageSelfEvaluationComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  studentData: StudentAssignment
  questions = []
  visualAssessments: StudentAssignmentEvaluation[] = []
  functionalAssessments: StudentAssignmentEvaluation[] = []

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private studentWorkpageService: StudentWorkpageService,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      this.studentWorkpageService.getAssignmentStudent(params.get('id')).subscribe(res => {
        if (!res || !res.data) this.router.navigate(['/work-page'])
        if(!this.checkAccess(res.data)) this.router.navigate(['/work-page'])

        this.studentData = res.data
        this.visualAssessments = res.data.evaluations.filter(t => t.type === SELF_ASSESSMENT_TYPE.VISUAL_INSPECTION)
        this.functionalAssessments = res.data.evaluations.filter(t => t.type === SELF_ASSESSMENT_TYPE.FUNCTIONAL_CHECK)
        this.genQuestionAnswers(res.data.questions)
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkAccess(studentData: StudentAssignment) {
    const showBtn = this.studentWorkpageService.genNextAction(studentData.status, studentData.internalStatus, studentData.isPassed)
    return showBtn.action === WORKPAGE_ACTION.STUDENT_EVALUATION
  }

  genQuestionAnswers(questions: StudentAssignmentQuestion[]) {
    questions.forEach(quest => {
      const answers = this.studentWorkpageService.genQuestionAnswersUI(quest, true)
      const rs = { title: quest.title, type: quest.type, score: quest.score, studentScore: quest.studentScore, feedback: quest.feedback, answers }
      if (quest.type === QUESTION_TYPE.MULTIPLE_CHOICE || quest.type === QUESTION_TYPE.FILL_IN) {
        rs['studentAnswers'] = quest.studentAnswers.map(t => t.answer)
      }
      this.questions.push(rs)
    })
  }

  checkEnableSubmit() {
    return this.visualAssessments.every(t => t.studentScore > 0) && this.functionalAssessments.every(t => t.studentScore > 0)
  }

  done(): void {
    if (this.checkEnableSubmit()) {
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
  }

  submitForm() {
    const sendData = { assignmentId: this.studentData.assignmentId, studentEvaluateItems: [] }
    sendData.studentEvaluateItems.push(...this.visualAssessments.map(t => ({ type: t.type, title: t.title, studentScore: t.studentScore })))
    sendData.studentEvaluateItems.push(...this.functionalAssessments.map(t => ({ type: t.type, title: t.title, studentScore: t.studentScore })))
    return this.studentWorkpageService.submitSelfEvaluation(sendData)
  }
}
