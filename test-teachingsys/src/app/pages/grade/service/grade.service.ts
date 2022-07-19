import { SuccessResponse, PaginationResponse } from './../../../shared/model/http-common.model';
import { GradeListItem } from './../model/grade-list';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientService } from '@app/@core/services/http-client.service';
import { GradeDetail } from '../model/grade-details';

enum Endpoint {
  GradeList = '/app/assignment/grade',
  GradeDetail = '/app/assignment/{id}/grade'
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  currentLang = localStorage.getItem('language');
  headers = new HttpHeaders({
      accept: 'text/plain',
      LanguageType: this.currentLang === 'zh' ? '1' : '0'
  });

  constructor(
    private _httpService: HttpClientService
  ) { }

  public getGradeList(page: number, pageSize: number): Observable<PaginationResponse<GradeListItem>> {
    const pagination = this._handlePagination(page, pageSize);
    const url = Endpoint.GradeList + `?SkipCount=${pagination.skipCount}&MaxResultCount=${pagination.maxResultCount}`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<any[]>) => {
          const list: any[] = data.data;
          const result: PaginationResponse<GradeListItem> = {
            totalCount: (data.totalCount) ? data.totalCount : 0,
            content: list.map(
              item => {
                return {
                  id: item.id,
                  task: item.taskTitle,
                  learningActivity: item.learningActivityTitle,
                  finalGrade: `${item.studentScore ? item.studentScore : 0} / ${item.assignmentScore}`
                }
              }
            )
          };
          return result;
        }
      )
    )
  }

  public getGradeDetail(id: string): Observable<GradeDetail> {
    let url: string = Endpoint.GradeDetail;
    url = url.replace('{id}', id);
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<GradeDetail>) => data.data
      )
    )
  }

  private _handlePagination(page: number, pageSize: number): { skipCount: number, maxResultCount: number } {
    return {
      skipCount: page - 1 < 0 ? 0 : (page - 1) * pageSize,
      maxResultCount: pageSize < 0 ? 0 : pageSize
    }
  }
}
