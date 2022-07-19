import { PaginationResponse, SuccessResponse } from '../../../shared/model/http-common.model';
import { Observable, of, map } from 'rxjs';
import { HttpClientService } from '../../../@core/services/http-client.service';
import { Injectable } from '@angular/core';
import { Class } from '../model/class.model';
import { ClassListItem, GroupListItem } from '../model/class-list-item.model';
import { Group } from '../model/group.model';
import { Student, StudentListItem } from '../model/student.model';
import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { APIs } from '@app/@core/apis';
import * as moment from 'moment';

enum EndPoint {
  Class = '/app/class',
  StudentByClass = '/app/student/by-class-id',
  StudentByGroup = '/app/student/by-group-id',
  Group = '/app/group'
}

export interface ClassParams {
  title?: string;
  openDateFrom?: string;
  openDateTo?: string;
}

@Injectable()
export class ClassManagementService {
  currentLang = localStorage.getItem('language');
    headers = new HttpHeaders({
        accept: 'text/plain',
        LanguageType: this.currentLang === 'zh' ? '1' : '0'
    });
  constructor(
    private _httpService: HttpClientService,
    private _datePipe: DatePipe
  ) {}

  public getClassList(page: number, pageSize: number, isIncludeGroup: boolean, params: ClassParams): Observable<PaginationResponse<ClassListItem>> {
    const pagination = this._handlePagination(page, pageSize);
    const url = EndPoint.Class +
      `?SkipCount=${
        pagination.skipCount
      }&MaxResultCount=${
        pagination.maxResultCount
      }&IsIncludeGroup=${
        isIncludeGroup ? 'true' : 'false'
      }${
        params.title ? `&Title=${params.title}` : ''
      }${
        params.openDateFrom ? `&OpenDateFrom=${params.openDateFrom}` : ''
      }${
        params.openDateTo ? `&OpenDateTo=${params.openDateTo}` : ''
      }`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<Class[]>) => {
          const classes: Class[] = data.data;
          const result: PaginationResponse<ClassListItem> = {
            totalCount: (data.totalCount) ? data.totalCount : 0,
            content: this._convertToTreeTableData(classes)
          };
          return result;
        }
      )
    );
  }

  public getStudentListByClassId(page: number, pageSize: number, id?: string): Observable<PaginationResponse<StudentListItem>> {
    const pagination = this._handlePagination(page, pageSize);
    const url = EndPoint.StudentByClass + `?SkipCount=${pagination.skipCount}&MaxResultCount=${pagination.maxResultCount}${id ? `&classId=${id}` : ''}`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<Student[]>) => {
          const students: Student[] = data.data;
          const result: PaginationResponse<StudentListItem> = {
            totalCount: (data.totalCount) ? data.totalCount : 0,
            content: this._convertToStudentListToAntTableData(students)
          };
          return result;
        }
      )
    );
  }
  public getStudents(id?: string): Observable<any> {
    const url = EndPoint.StudentByClass + `?SkipCount=0&MaxResultCount=1000`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<any>) => {
          const result = data.data.map((e) => {
            return {...e, creationTime: this._datePipe.transform(e.creationTime, 'yyyy-MM-dd'),}
          })
          return this._convertToStudentListToAntTableData(result);
        }
      )
    );
  }

  public getStudentListByGroupId(id: string, page: number, pageSize: number): Observable<PaginationResponse<StudentListItem>> {
    const pagination = this._handlePagination(page, pageSize);
    const url = EndPoint.StudentByGroup + `/${id}?SkipCount=${pagination.skipCount}&MaxResultCount=${pagination.maxResultCount}`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<Student[]>) => {
          const students: Student[] = data.data;
          const result: PaginationResponse<StudentListItem> = {
            totalCount: (data.totalCount) ? data.totalCount : 0,
            content: this._convertToStudentListToAntTableData(students)
          };
          return result;
        }
      )
    );
  }

  public getGroupByClassId(id: string): Observable<Group[]> {
    const url = EndPoint.Group + `/by-class-id/${id}`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<Group[]>) => data.data
      )
    );
  }

  public createNewGroup(data: any): Observable<string> {
    const request = {
      title: "",
      description: "",
      titleEnglish: data.titleEnglish,
      titleChinese: data.titleChinese,
      descriptionChinese: "",
      descriptionEnglish: "",
      classUniqId: data.id,
      studentCount: 0
    }
    const url = EndPoint.Group;
    return this._httpService.post(url, request).pipe(
      map((data: SuccessResponse<string>) => data.data)
    );
  }

  public addStudentToGroup(id: string, studentIds: string[]): Observable<string> {
    const request = {
      groupUniqId: id,
      listStudentId: [
        ...studentIds
      ]
    };
    const url = EndPoint.Group + `/student`;
    return this._httpService.post(url, request).pipe(
      map((data: SuccessResponse<string>) => data.data)
    );
  }

  public moveStudentToGroup(fromId: string, toId: string, studentIds: string[]): Observable<string> {
    const request = {
      oldGroupUniqId: fromId,
      newGroupUniqId: toId,
      listStudentId: [
        ...studentIds
      ]
    };
    const url = EndPoint.Group + `/move-student`;
    return this._httpService.post(url, request).pipe(
      map((data: SuccessResponse<string>) => data.data)
    );
  }

  public removeStudentFromGroup(id: string, studentIds: string[]): Observable<string> {
    const request = {
      groupUniqId: id,
      listStudentId: [
        ...studentIds
      ]
    };
    const url = EndPoint.Group + `/delete-student`;
    return this._httpService.post(url, request).pipe(
      map((data: SuccessResponse<string>) => data.data)
    );
  }

  public deleteGroup(id: string): Observable<string> {
    const url = EndPoint.Group + `/${id}/delete`;
    return this._httpService.get(url, {
      headers: this.headers
    }).pipe(
      map(
        (data: SuccessResponse<string>) => data.data
      )
    );
  }

  public createClass(data: any): Observable<string> {
    const url = EndPoint.Class;
    return this._httpService.post(url, data).pipe(
      map((data: SuccessResponse<string>) => data.data)
    )
  }
  public updateClass(data: any): Observable<string> {
    const url = EndPoint.Class + '/update';
    return this._httpService.post(url, data).pipe(
      map((data: SuccessResponse<string>) => data.data)
    )
  }
  public addStudentToClass(data: any): Observable<string> {
    const url = EndPoint.Class + '/student';
    return this._httpService.post(url, data).pipe(
      map((data: SuccessResponse<string>) => data.data)
    )
  }

  private _handlePagination(page: number, pageSize: number): { skipCount: number, maxResultCount: number } {
    return {
      skipCount: page - 1 < 0 ? 0 : (page - 1) * pageSize,
      maxResultCount: pageSize < 0 ? 0 : pageSize
    }
  }

  private _convertToTreeTableData(data: Class[]): ClassListItem[] {
    const result: ClassListItem[] = [];
    data.forEach((item: Class, i: number) => {
      const classItem: ClassListItem = {
        key: i + 1,
        id: item.uniqId,
        title: item.title,
        description: item.description,
        numberOfGroup: item.groups.length,
        studentCount: item.studentCount,
        openTime: this._datePipe.transform(item.creationTime, 'yyyy-MM-dd'),
        children: []
      };
      if (item.groups.length > 0) {
        item.groups.forEach((group: Group, j: number) => {
          const groupItem: GroupListItem = {
            key: classItem.key + '-' + (j + 1),
            id: group.groupUniqId,
            classId: group.classUniqId,
            title: group.title,
            description: group.description,
            studentCount: group.studentCount,
            openTime: ''
          };
          classItem.children.push(groupItem);
        });
      }
      result.push(classItem);
    });
    return result;
  }

  private _convertToStudentListToAntTableData(data: Student[]): StudentListItem[] {
    const result: StudentListItem[] = [];
    data.forEach((student: Student, i: number) => {
      let groupString = '';
      if (student.groups) {
        student.groups.forEach(
          (group, index) => {
            groupString += (index === 0) ?  group.title : ', ' + group.title;
          }
        );
      }
      const studentItem: StudentListItem = {
        key: i + 1,
        ...student,
        group: groupString,
      };
      result.push(studentItem);
    });
    return result;
  }

  getGroupDetail(groupId: string): Observable<any> {
    return this._httpService.get(APIs.classManagement.group+'/'+groupId, {
      headers: this.headers
    }).pipe(map(res => {
        return res;
    }));
  }

  public getClassAdminList(): Observable<any> {
    return this._httpService
      .get(APIs.classManagement.class + '?SkipCount=0&MaxResultCount=1000', {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  
  public deleteClass(classId): Observable<any> {
    return this._httpService
      .get(APIs.classManagement.class + '/' + classId + '/delete', {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  public classDetail(classId): Observable<any> {
    return this._httpService
      .get(APIs.classManagement.class + '/' + classId, {
        headers: this.headers,
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  public removeStudent(data): Observable<any> {
    return this._httpService
      .post(APIs.classManagement.removeStudent, data)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

}
