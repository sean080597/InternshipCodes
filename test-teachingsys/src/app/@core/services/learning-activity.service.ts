import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QUESTION_BANK } from '../models/dummy-data/question-bank';
import { delay } from 'rxjs/operators';
import { HttpClientService } from './http-client.service';
import { map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIs } from '../apis';
import { LearningActivity } from '../models/learning-activity';
import { QuestionBanks } from '../models/question-bank';

// only for testing
const DELAY_TIME = 1000;
// ----
@Injectable({
    providedIn: 'root',
})
export class LearningActivityService {
    currentLang = localStorage.getItem('language');
    headers = new HttpHeaders({
        accept: 'text/plain',
        LanguageType: this.currentLang === 'zh' ? '1' : '0'
    });
    constructor(private httpService: HttpClientService) { }
    public getTaskList(): Observable<any> {
        const converted: any = [];
        QUESTION_BANK.forEach((item: any, i: number) => {
            const result: any = {
                key: i + 1,
                title: item.title,
                description: item.description,
                updated: item.updated,
                children: [],
            };
            if (item.activities.length > 0) {
                item.activities.forEach((child: any, j: number) => {
                    child.key = result.key + '-' + (j + 1);
                    result.children.push({
                        key: child.key,
                        title: child.title,
                        description: child.description,
                        updated: child.updated,
                    });
                });
            }
            converted.push(result);
        });
        return of(converted).pipe(delay(DELAY_TIME));
        // return this.httpService.get('https://phatlt9.free.beeceptor.com/haha').pipe(map(res => {
        //   return res;
        // }))
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
    public updateGeneralInformation(
        generalInfo: LearningActivity
    ): Observable<any> {
        return this.httpService.post(APIs.learningActivity.base + '/update', generalInfo).pipe(
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
    public getLearningActivityList(): Observable<any> {
        return this.httpService
            .get(APIs.learningActivity.base+'?SkipCount=0&MaxResultCount=1000', {
                headers: this.headers,
            })
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }
    public getLearningActivityViewDetail(param): Observable<any> {
        return this.httpService
            .get(`${APIs.learningActivity.view_details}${param}`, {
                headers: this.headers,
            })
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }
    public getLearningActivityByID(activityID: string): Observable<any> {
        return this.httpService
            .get(`${APIs.learningActivity.base}/${activityID}?MaxResultCount=1000`,{
                headers: this.headers,
            })
            .pipe(
                map((res) => {
                    return res;
                })
            );
    }
    public getLearningActivityByTask(taskId: string): Observable<any> {
        return this.httpService
        .get(`${APIs.questionBank.learningActivity}?taskUniqueId=${taskId}&MaxResultCount=1000`,{
            headers: this.headers,
        })
        .pipe(
            map((res) => {
                return res;
            })
        );
    }
    public deleteLearningActivity(activityID): Observable<any> {
        return this.httpService
        .get(`${APIs.learningActivity.base}/${activityID}/delete`)
        .pipe(
            map((res) => {
                return res;
            })
        );
    }
    public getQuestionsByLearningActivity(learningActivityID: string) {
        return this.httpService
        .get(`${APIs.questionBank.learningActivity}/${learningActivityID}?MaxResultCount=1000`,{
            headers: this.headers,
        })
        .pipe(
            map((res) => {
                return res.data;
            })
        );
    }

    public saveActivityToTask(data: any) {
        return this.httpService.post(APIs.learningActivity.saveQuestion, data).pipe(map((res) => {
            return res;
        }));
    }

    public addNewTask(data) {
        return this.httpService.post(APIs.task.base, data).pipe(map((res) => {
            return res;
        }));
    }

    public getTaskByID(taskId: string) {
        return this.httpService
        .get(`${APIs.task.base}/${taskId}`,{
            headers: this.headers,
        })
        .pipe(
            map((res) => {
                return res.data;
            })
        );
    }

    public assignStudentToLA(data) {
        return this.httpService.post(APIs.learningActivity.assign, data).pipe(map((res) => {
            return res;
        }));
    }
}
