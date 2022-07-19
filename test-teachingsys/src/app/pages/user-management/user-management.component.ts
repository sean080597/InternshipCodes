import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@app/@core/models/role';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminListComponent } from './admin-list/admin-list.component';
import { StudentListComponent } from './student-list/student-list.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(StudentListComponent) studentChildCmp: StudentListComponent;
  @ViewChild(TeacherListComponent) teacherChildCmp: TeacherListComponent;
  @ViewChild(AdminListComponent) adminChildCmp: AdminListComponent;
  selectedTabIdxLs = [0]
  selectedIdx = 0

  constructor(
    private router: Router,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void { }

  onCreate() {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('add_user'),
      nzContent: UserFormComponent,
      nzWidth: '50%',
      nzCentered: true,
    });
    modal.afterClose.subscribe(res => {
      if (res && res.isSubmitted) {
        if (res.title === Role.Student) this.studentChildCmp.searchData(true)
        else if (res.title === Role.Teacher) this.teacherChildCmp.searchData(true)
        else this.adminChildCmp.searchData(true)
      }
    })
  }

  onChangeSelectedTabIdx(idx: number) {
    if (this.selectedTabIdxLs.includes(idx)) return
    this.selectedTabIdxLs.push(idx)
  }
}
