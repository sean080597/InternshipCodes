import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { QUESTION_BANK } from '../models/dummy-data/question-bank';
import { delay } from 'rxjs/operators';
import { HttpClientService } from './http-client.service';
import { APIs } from '../apis';
import * as moment from 'moment';
import { LearningActivity } from '../models/learning-activity';
import { QuestionBanks } from '../models/question-bank';
import { DATETIME_FORMATS } from '../constants';
import { HttpHeaders } from '@angular/common/http';
// only for testing
const DELAY_TIME = 1000;
// ----

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  currentLang = localStorage.getItem('language');
  headers = new HttpHeaders({
      accept: 'text/plain',
      LanguageType: this.currentLang === 'zh' ? '1' : '0'
  });
  constructor(private httpService: HttpClientService) { }
  public getQuestionBank(): Observable<any> {
    const converted: any = [];
    QUESTION_BANK
    return this.httpService.get(APIs.questionBank.questionBankList+'?MaxResultCount=1000', {
      headers: this.headers
    }).pipe(map(res => {
      res.items.forEach((item: any, i: number) => {
        const result: any = {
          key: i+1,
          title: item.title,
          children: []
        }
        if (item.activities.length > 0) {
          item.activities.forEach((child: any, j: number) => {
            child.key = result.key + '-' + (j+1);
            result.children.push({
              id: child.id,
              key: child.key,
              title: child.title,
              description: child.description,
              updated: moment(child.modifiedDate).format(DATETIME_FORMATS.MOMENT_FORMAT_YYYY_MM_DD_s),
              author: child.author
            })
          })
        }
        converted.push(result);
      })
      return converted;
  }));
  }

  public deleteLearningActivity(activityID): Observable<any> {
    return this.httpService
        .post(`${APIs.questionBank.learningActivity}/${activityID}/delete`)
        .pipe(
            map((res) => {
            })
        );
}

  public getLearningActivityByID(activityID: string): Observable<any> {
    return this.httpService
        .get(`${APIs.questionBank.learningActivity}/${activityID}?MaxResultCount=1000`, {
          headers: this.headers
        })
        .pipe(
            map((res) => {
                return res;
            })
        );
}

  public saveGeneralInformation(
    generalInfo: LearningActivity
  ): Observable<any> {
    return this.httpService.post(APIs.learningActivity.base, generalInfo).pipe(
        map((res) => {
            return res;
        })
    );
  }

  public saveQuestion(questions: QuestionBanks): Observable<any> {
    return this.httpService
        .post(APIs.learningActivity.question, questions)
        .pipe(
            map((res) => {
                return res;
            })
        );
  }

  public updateQuestionBankLearningActivity(questions): Observable<any> {
    return this.httpService
        .post(`${APIs.questionBank.learningActivity}/update`, questions)
        .pipe(
            map((res) => {
                return res;
            })
        );
  }

  public getTask(): Observable<any> {
    return this.httpService.get(APIs.questionBank.taskList+'?MaxResultCount=1000', {
      headers: this.headers
    }).pipe(map(res => {
        return res;
    }));
  }
  public getTaskForSave(): Observable<any> {
    return this.httpService.get(APIs.task.base+'?MaxResultCount=1000', {
      headers: this.headers
    }).pipe(map(res => {
        return res;
    }));
  }
}
