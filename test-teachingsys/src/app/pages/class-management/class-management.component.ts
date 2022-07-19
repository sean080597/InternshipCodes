import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DATATABLE_ACTIONS } from '@app/@core/constants';
import { UserService } from '@app/@core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ClassManagementService } from '../class/service/class-management.service';
import { AddClassComponent } from './add-class/add-class.component';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss']
})
export class ClassManagementComponent implements OnInit {
  currentLang = localStorage.getItem('language');
  tableFields = [
    {
      header: this.translate.instant('class'),
      fieldName: 'title',
      isFilter: true,
    },
    {
      header: this.translate.instant('openDate'),
      fieldName: 'creationTime',
      compare: (a: any, b: any) => (new Date(a.creationTime).getTime()) - (new Date(b.creationTime).getTime()),
    },
    {
      header: this.translate.instant('number_of_students'),
      fieldName: 'studentCount',
      compare: (a: any, b: any) => a.studentCount - b.studentCount,
    },
    {
      header: this.translate.instant('teacher'),
      fieldName: 'teachers',
      compare: (a: any, b: any) => a.teachers - b.teachers,
    }
  ];
  actionButtons = [
    {
      title: this.translate.instant('edit'),
      hasPermission: true,
      action: DATATABLE_ACTIONS.EDIT,
    },
    {
      title: this.translate.instant('delete'),
      hasPermission: true,
      action: DATATABLE_ACTIONS.DELETE,
    },
  ];
  searchTitleValue = '';
  visible = false;
  listOfData = [];
  listOfDisplayData = [...this.listOfData];
  modal = {
    title: '',
    content: ''
  }
  isVisible = false;
  onChoosenClass: any;
  studentList: any = [];
  teacherList: any = [];
  constructor(
    private translate: TranslateService,
    private classService: ClassManagementService,
    private userService: UserService,
    private modalService: NzModalService,
    private router: Router,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.getClass();
    this.getStudentNotAssign();
    this.getTeacher();
  }
  
  getStudentNotAssign() {
    this.classService.getStudents().subscribe(res => {
      this.studentList = res;
    });
  }
  getTeacher() {
    this.userService.getAllTeachers().subscribe(res => {
      this.teacherList = res
    })
  }
  getClass() {
    this.classService.getClassAdminList().subscribe(res => {
      this.listOfData = res.data.filter((e)=> e.title);
    }).add(() => {
      this.resetTitleSearch();
    })
  }

  resetTitleSearch(): void {
    this.searchTitleValue = '';
    this.searchTitle();
  }

  searchTitle(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: any) => item.title.indexOf(this.searchTitleValue) !== -1);
  }

  tableActionOnClick(action, data) {
    console.log(action, data)
    if (action === DATATABLE_ACTIONS.EDIT) {
      this.router.navigate(['class-management', data.uniqId]);
    } else if (action === DATATABLE_ACTIONS.DELETE) {
      this.modal = {
        // Are you sure you want to delete? 
        title: this.translate.instant('delete_confirm_title'),
        // This action can not be revised!
        content: this.translate.instant('delete_confirm_content')
      }
      this.onChoosenClass = data.uniqId;
      this.showModal();
    }
  }

  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
    this.classService
        .deleteClass(this.onChoosenClass)
        .subscribe({
            next: (v) => {
              this.msg.success(
                this.translate.instant('data_deleted', {
                  field: this.translate.instant('class'),
                })
              );
                this.getClass();
            },
            error: (e) => {
            },
            complete: () => console.info('complete')
        });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  public onCreate(): void {
    const modal = this.modalService.create({
      nzTitle: this.translate.instant('add_student'),
      nzWidth: '1800px',
      nzContent: AddClassComponent,
      nzComponentParams: {
        isAddClass: true,
        studentList: this.studentList,
        teacherList: this.teacherList,
      }
    });
    modal.afterClose.subscribe(result => {
      if (result?.isSubmit) {
        const studentIds = result.selectedStudent.map(item => item.id);
        const teacherIds = result.selectedTeachers.map(item => item.id);
        this.classService.createClass({
          titleChinese: result.titleChinese,
          titleEnglish: result.titleEnglish,
          studentIds: studentIds,
          teacherIds: teacherIds,
        }).subscribe(() => {
          this.msg.success(
            this.translate.instant('data_created', {
              field: this.translate.instant('class'),
            })
          );
          this.getClass()
        } );
      }
    });
  }
  goToDetail(id) {
    this.router.navigate(['class-management', id]);
  }
  renderTeachers(teacherObj) {
    return teacherObj.map(t => {
      return this.currentLang === 'zh' ? t.fullNameChinese : t.fullNameEnglish;
    })
  }
}
