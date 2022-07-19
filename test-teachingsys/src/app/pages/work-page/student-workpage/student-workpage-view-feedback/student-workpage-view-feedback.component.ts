import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentWorkpageService } from '@app/@core/services/student-workpage.service';
import { QUESTION_TYPE, WORKPAGE_ACTION } from '@app/@core/constants';
import { StudentAssignment, StudentAssignmentQuestion } from '@app/@core/models/student-workpage';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-workpage-view-feedback',
  templateUrl: './student-workpage-view-feedback.component.html',
  styleUrls: ['./student-workpage-view-feedback.component.scss']
})
export class StudentWorkpageViewFeedbackComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  studentData: StudentAssignment
  questions = []

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private studentWorkpageService: StudentWorkpageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      this.studentWorkpageService.getAssignmentStudent(params.get('id')).subscribe(res => {
        if (!res || !res.data) this.router.navigate(['/work-page'])
        if(!this.checkAccess(res.data)) this.router.navigate(['/work-page'])

        this.studentData = res.data
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
    return showBtn.action === WORKPAGE_ACTION.STUDENT_VIEW_FEEDBACK
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

  done(): void {
    this.router.navigate(['/work-page/questions', this.studentData.assignmentId])
  }
}
