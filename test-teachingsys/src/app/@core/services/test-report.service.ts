import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, from, map, mergeMap, Observable, toArray } from 'rxjs';
import { APIs } from '@app/@core/apis';
import { DATETIME_FORMATS, STUDENT_STT } from '@app/@core/constants';
import { Filter } from '@app/@core/interfaces';
import { ActivityReport, ClassReport, ClassReportDetails, QuestionReport, TestReport } from '@app/@core/models/test-report';
import { HttpClientService } from '@app/@core/services/http-client.service';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestReportService {
  sttColorList = [
    { stt: STUDENT_STT.NOT_START, color: '' },
    { stt: STUDENT_STT.STARTED, color: 'blue' },
    { stt: STUDENT_STT.PENDING, color: 'red' },
    { stt: STUDENT_STT.COMPLETED, color: 'yellow' },
    { stt: STUDENT_STT.ACTIVITY_FEEDBACK, color: 'green' },
    { stt: STUDENT_STT.NOT_ATTEMPT, color: '' },
  ]

  private _classReportsDetailsList = new BehaviorSubject<ClassReportDetails[]>([]);
  readonly classReportsDetailsList$ = this._classReportsDetailsList.asObservable();
  private _seledtedQuestionReportList = new BehaviorSubject<QuestionReport[]>([]);
  readonly selectedQuestionReportList$ = this._seledtedQuestionReportList.asObservable();
  private _selectedClassIdx = new BehaviorSubject<number>(0);
  readonly selectedClassIdx$ = this._selectedClassIdx.asObservable();
 
  currentLang = localStorage.getItem('language');
  headers = new HttpHeaders({
      accept: 'text/plain',
      LanguageType: this.currentLang === 'zh' ? '1' : '0'
  });
  constructor(
    private httpService: HttpClientService,
  ) { }

  public get classReportsDetailsList(): ClassReportDetails[] {
    return this._classReportsDetailsList.value
  }
  setClassReportsDetailsList(reportDetails: ClassReportDetails[]) {
    this._classReportsDetailsList.next(reportDetails)
    this._selectedClassIdx.next(0)
    if (reportDetails.length > 0) {
      this._seledtedQuestionReportList.next(reportDetails[this.selectedClassIdx].questionReports)
    }
  }

  public get selectedQuestionReportList(): QuestionReport[] {
    return this._seledtedQuestionReportList.value
  }

  public get selectedClassIdx() {
    return this._selectedClassIdx.value
  }
  setSelectedClassIdx(idx: number) {
    this._selectedClassIdx.next(idx)
    if (this.classReportsDetailsList.length > 0) {
      this._seledtedQuestionReportList.next(this.classReportsDetailsList[this.selectedClassIdx].questionReports)
    }
  }

  buildFilter(filter: Filter) {
    return { skipcount: (filter.pageIndex - 1) * filter.pageSize, maxResultCount: filter.pageSize }
  }

  public getAllTasks(params?): Observable<any> {
    return this.httpService.get(APIs.testReport.base, { params, headers: this.headers }).pipe(map(res => {
      const converted = []
      res.data.forEach((item: TestReport, i: number) => {
        const result: any = {
          key: i + 1,
          title: item.taskName,
          children: []
        }
        if (item.learningActivityReports.length > 0) {
          item.learningActivityReports.forEach((child: ActivityReport, j: number) => {
            const childKey = result.key + '-' + (j + 1);
            result.children.push({
              id: child.learningActivityUniqId,
              key: childKey,
              title: child.learningActivityTitle,
              description: child.learningActivityDescription,
              dueDate: moment(child.dueDate).format(DATETIME_FORMATS.MOMENT_FORMAT_YYYY_MM_DD_d),
              numberSubmission: [child.numberOfSubmission, child.totalSubmission].join('/'),
            })
          })
        }
        converted.push(result);
      })
      return converted;
    }))
  }

  public getActivityDetails(id: string) {
    return this.httpService.get(APIs.testReport.base + '/' + id + '/learning-activity-report')
  }

  public getClassReport(params) {
    return this.httpService.get(APIs.testReport.classReport, { params }).pipe(map(res => res.data))
  }

  public getMultiClassReport(learningActivityUniqId: string, classList: ClassReport[]) {
    const reqParamsList = classList.map(cl => { return { learningActivityUniqId, classUniqId: cl.classUniqId } })
    return from(reqParamsList).pipe(mergeMap(params => this.getClassReport(params)), catchError(() => EMPTY), toArray())
  }

  genStatusColor(status: STUDENT_STT) {
    return this.sttColorList.find(t => t.stt === status)?.color
  }

  // groupByKey(xs) {
  //   return xs.reduce((rv, x) => {
  //     if (!Array.isArray(rv)) rv = []
  //     const found = rv.find(t => t.status === x['status'])
  //     if (found) found.count++
  //     else rv.push({ status: x['status'], count: 1 })
  //     return rv;
  //   }, {});
  // };

  // genTagList(classObj: ClassReport) {
  //   return this.groupByKey(classObj.)
  // }
}
