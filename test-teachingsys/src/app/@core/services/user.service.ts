import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { HttpClientService } from '@app/@core/services/http-client.service';
import { APIs } from '@app/@core/apis';
import { Filter } from '@app/@core/interfaces';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserFormComponent } from '@app/pages/user-management/user-form/user-form.component';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  filterStudent: Filter = { pageIndex: 1, pageSize: 10, totalCount: 0 }
  filterTeacher: Filter = { pageIndex: 1, pageSize: 10, totalCount: 0 }
  filterAdmin: Filter = { pageIndex: 1, pageSize: 10, totalCount: 0 }

  constructor(private httpService: HttpClientService, private modalService: NzModalService,) { }

  buildFilter(filter: Filter) {
    return { skipcount: (filter.pageIndex - 1) * filter.pageSize, maxResultCount: filter.pageSize }
  }

  public getAllStudents(params?): Observable<any> {
    return this.httpService.get(APIs.userManagement.students, { params })
  }

  public getAllTeachers(params?): Observable<any> {
    return this.httpService.get(APIs.userManagement.teachers, { params })
  }

  public getAllAdmins(params?): Observable<any> {
    return this.httpService.get(APIs.userManagement.admin_users, { params })
  }

  public createUser(data): Observable<any> {
    return this.httpService.post(APIs.userManagement.base, data)
  }

  public updateUser(data): Observable<any> {
    return this.httpService.post(APIs.userManagement.base + '/update', data)
  }

  public deleteUser(id: string): Observable<any> {
    return this.httpService.post(APIs.userManagement.base + '/' + id + '/delete')
  }

  openEditModal(student: User, title: string, callback?: any) {
    const modal = this.modalService.create({
      nzTitle: title,
      nzContent: UserFormComponent,
      nzComponentParams: { userData: student },
      nzWidth: '50%',
      nzCentered: true
    });
    modal.afterClose.subscribe(res => {
      if (res && res.isSubmitted) {
        callback ? callback(res) : () => { }
      }
    })
  }

  openDeleteModal(studentId: string, title: string, content: string, callback?: any) {
    this.modalService.create({
      nzTitle: title,
      nzContent: content,
      nzCentered: true,
      nzOnOk: () => new Promise(resolve => {
        this.deleteUser(studentId).pipe(finalize(() => resolve())).subscribe((res) => callback ? callback(res) : () => { })
      })
    });
  }
}
