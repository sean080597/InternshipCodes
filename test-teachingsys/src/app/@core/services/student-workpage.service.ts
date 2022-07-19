import { Injectable } from '@angular/core';
import { APIs } from '@app/@core/apis';
import { QUESTION_TYPE, WORKPAGE_ACTION, WORKPAGE_ACTION_BTNS, WORKPAGE_STT } from '@app/@core/constants';
import { Filter } from '@app/@core/interfaces';
import { StudentAssignmentQuestion } from '@app/@core/models/student-workpage';
import { HttpClientService } from '@app/@core/services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentWorkpageService {
  filterStudent: Filter = { pageIndex: 1, pageSize: 10, totalCount: 0 }

  constructor(private httpService: HttpClientService) { }

  buildFilter(filter: Filter) {
    return { skipcount: (filter.pageIndex - 1) * filter.pageSize, maxResultCount: filter.pageSize }
  }

  public getAllWorkpage(params?): Observable<any> {
    return this.httpService.get(APIs.studentWorkpage.workpage, { params })
  }

  public getAssignmentStudent(id: string): Observable<any> {
    return this.httpService.post(APIs.studentWorkpage.base + '/' + id + '/student-start')
  }

  public submitWorkpagePending(data): Observable<any> {
    return this.httpService.post(APIs.studentWorkpage.workpageSubmitPending, data)
  }

  public submitWorkpageCompleted(data): Observable<any> {
    return this.httpService.post(APIs.studentWorkpage.workpageSubmitCompleted, data)
  }

  public submitSelfEvaluation(data): Observable<any> {
    return this.httpService.post(APIs.studentWorkpage.selfEvaluation, data)
  }

  public submitGiveFeedback(data): Observable<any> {
    return this.httpService.post(APIs.studentWorkpage.giveFeedback, data)
  }

  public genQuestionAnswersUI(question: StudentAssignmentQuestion, mapAnswers = false) {
    let answers = []
    switch (question.type) {
      case QUESTION_TYPE.MULTIPLE_CHOICE:
        answers = question.questionAnswers.map((t, idx) => {
          const checked = mapAnswers ? (question.questionAnswers[idx].isCorrect ?? false) : false
          return { label: t.answer, value: t.uniqId, checked }
        })
        break;
      case QUESTION_TYPE.ESSAY:
        answers = [{ "answer": mapAnswers ? (question.studentAnswers[0]?.answer ?? '') : '' }]
        break;
      case QUESTION_TYPE.FILL_IN:
        answers = question.questionAnswers.map((t, idx) => ({ "answer": mapAnswers ? (question.questionAnswers[idx]?.answer ?? '') : '' }))
        break;
      case QUESTION_TYPE.WORK_PLAN_TABLE:
        answers = Array(24).fill(null).map((t, idx) => ({
          step: mapAnswers ? (question.studentAnswers[idx]?.step ?? '') : '',
          tool: mapAnswers ? (question.studentAnswers[idx]?.tool ?? '') : '',
          safetyEnv: mapAnswers ? (question.studentAnswers[idx]?.safetyEnv ?? '') : '',
          workingHours: mapAnswers ? (question.studentAnswers[idx]?.workingHours ?? 0) : 0,
          note: mapAnswers ? (question.studentAnswers[idx]?.note ?? '') : '',
        }))
        break;
      case QUESTION_TYPE.VISUAL_INSPEC_TABLE:
        answers = question.interpretations.map((t, idx) => {
          const isAcceptable = mapAnswers ? (question.studentAnswers[idx]?.isAcceptable ?? null) : true
          return { interpretation: t, isAcceptable }
        })
        break;
      default:
        break;
    }
    return answers
  }

  public genNextAction(status: string, internalStatus: string, isPassed?: boolean) {
    status = status?.toLowerCase()
    internalStatus = internalStatus?.toLowerCase()

    let nextAction = null
    if (status === WORKPAGE_STT.NOT_START || status === WORKPAGE_STT.STARTED) {
      nextAction = WORKPAGE_ACTION.STUDENT_START
    } else if (internalStatus === WORKPAGE_STT.PENDING_FOR_REVIEW) {
      nextAction = WORKPAGE_ACTION.TEACHER_GIVE_REVIEW
    } else if (internalStatus === WORKPAGE_STT.REVIEWED) {
      nextAction = WORKPAGE_ACTION.STUDENT_VIEW_FEEDBACK
    } else if (status === WORKPAGE_STT.COMPLETED && internalStatus === WORKPAGE_STT.REVIEWED && isPassed) {
      nextAction = WORKPAGE_ACTION.TEACHER_EVALUATION
    } else if (internalStatus === WORKPAGE_STT.TEACHER_EVALUATED) {
      nextAction = WORKPAGE_ACTION.STUDENT_EVALUATION
    } else if (internalStatus === WORKPAGE_STT.SELF_EVALUATED) {
      nextAction = WORKPAGE_ACTION.STUDENT_GIVE_FEEDBACK
    }
    return WORKPAGE_ACTION_BTNS.find(t => t.action === nextAction)
  }
}
