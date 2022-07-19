import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/@core/services/common.service';
import { UserService } from '@app/@core/services/user.service';
import { ClassManagementService } from '@app/pages/class/service/class-management.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddClassComponent } from '../add-class/add-class.component';
@Component({
  selector: 'app-class-detail-admin',
  templateUrl: './class-detail-admin.component.html',
  styleUrls: ['./class-detail-admin.component.scss']
})
export class ClassDetailAdminComponent implements OnInit {
  classId = '';
  classData: any = {};
  currentLang = localStorage.getItem('language');
  checked = false;
  indeterminate = false;
  configSearchCols: any = {};
  listOfMapData = [];
  isVisible = false;
  listOfDisplayData = [...this.listOfMapData];
  tableFields = [
    {
      header: this.translate.instant('tbl.id'),
      fieldName: 'userId',
      isFilter: true,
    },
    {
      header: this.translate.instant('tbl.chineseName'),
      fieldName: 'fullNameChi',
      isFilter: true,
    },
    {
      header: this.translate.instant('tbl.englishName'),
      fieldName: 'fullNameEng',
      isFilter: true,
    },
    {
      header: this.translate.instant('tbl.email'),
      fieldName: 'emailAddress',
      isFilter: true,
    },
    {
      header: this.translate.instant('tbl.phone'),
      fieldName: 'phoneNumber',
      isFilter: true,
    },
    {
      header: this.translate.instant('openDate'),
      fieldName: 'creationTime',
      compare: (a: any, b: any) => (new Date(b.creationTime).getTime()) - (new Date(a.creationTime).getTime()),
    },
  ];
  selectedStudent = [];
  teacherList: any = [];
  modal = {
    title: '',
    content: ''
  }
  studentList = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private classService: ClassManagementService,
    private commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.classId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  listOfCurrentPageData: readonly any[] = [];
  setOfCheckedId = new Set<string>();
  resetCheckbox() {
    this.setOfCheckedId = new Set<string>();
  }
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.selectedStudent = Array.from(this.setOfCheckedId);
    console.log(this.selectedStudent)
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.userId, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly any[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.userId));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.userId)) && !this.checked;
  }

  ngOnInit(): void {
    this.selectedStudent = [];
    this.resetCheckbox();
    this.randomColor();
    this.getClassDetail();
    this.getStudentNotAssign();
    this.getTeacher();
    this.resetSearch(this.tableFields[0].fieldName);
    this.tableFields.forEach(field => {
      this.configSearchCols[field.fieldName] = {
        searchVisible: false,
        searchValue: ''
      }
    })
  }

  getClassDetail() {
    this.classService.classDetail(this.classId).subscribe(res => {
      this.classData = res.data
      this.listOfMapData = this.listOfDisplayData = this.classData.students;
      this.classData.teachers = this.classData.teachers.map((teacher) => {
        return { ...teacher, color: this.randomColor() }
      });
      console.log(this.classData)
    })
  }

  randomColor() {
    return this.commonService.randomColor()
  }

  resetSearch(fieldName): void {
    if (this.configSearchCols[fieldName]) {
      this.configSearchCols[fieldName].searchValue = '';
    }
    this.search(fieldName);
  }

  search(fieldName): void {
    if (this.configSearchCols[fieldName]) {
      this.configSearchCols[fieldName].searchVisible = false;
    }
    this.listOfDisplayData = this.listOfMapData.filter((item) => {
      return item[fieldName]?.indexOf(this.configSearchCols[fieldName].searchValue) !== -1;
    });
  }

  removeStudent() {
    this.isVisible = true;
    this.modal = {
      // Are you sure you want to delete? 
      title: this.translate.instant('delete_confirm_title'),
      // This action can not be revised!
      content: this.translate.instant('delete_confirm_content')
  }
  }

  handleAction(isOk: boolean): void {
    if(isOk) {
      this.classService
          .removeStudent({
            classUniqId: this.classData.classUnidId,
            listStudentId: this.selectedStudent
          })
          .subscribe({
              next: (v) => {
                  this.refreshCheckedStatus()
                  this.ngOnInit();
              },
              error: (e) => {
                },
                complete: () => console.info('complete')
            });
    }
    this.isVisible = false;
  }
  public addStudent(): void {
    const selectedTeachers = this.classData.teachers.map(teacher => {
      return {
        id: teacher.id,
        fullNameEnglish: teacher.fullNameEnglish,
        fullNameChinese: teacher.fullNameChinese
      }
    });
    const modal = this.modalService.create({
      nzTitle: this.translate.instant('add_student'),
      nzWidth: '1800px',
      nzContent: AddClassComponent,
      nzComponentParams: {
        studentList: this.studentList,
        teacherList: this.teacherList,
        currentClass: this.classData,
        selectedTeachers: selectedTeachers,
        isAddClass: false,
      }
    });
    modal.afterClose.subscribe(result => {
      if (result?.isSubmit) {
        const studentIds = result.selectedStudent.map(item => item.id);
        const teacherIds = result.selectedTeachers.map(item => item.id);
        const uniqTeacherIds = Array.from([...new Set(teacherIds)]);
        this.classService.updateClass({
          titleChinese: 'class chinense nha',
          titleEnglish: 'class english nha',
          // titleChinese: this.classData.titleChinese,
          // titleEnglish: this.classData.titleEnglish,
          teacherIds: uniqTeacherIds,
          classUniqId: this.classData.uniqId
        }).subscribe(() => {
          if (studentIds.length > 0) {
            console.log('class updated')
          } else {
            this.msg.success(
              this.translate.instant('data_updated', {
                field: this.translate.instant('class'),
              })
            );
            this.ngOnInit()
          }
        });
        if (studentIds.length > 0) {
          this.classService.addStudentToClass({
            listStudentId: studentIds,
            teacherIds: teacherIds,
            classUniqId: this.classData.uniqId
          }).subscribe(() => {
            this.msg.success(
              this.translate.instant('data_updated', {
                field: this.translate.instant('class'),
              })
            );
            this.ngOnInit()
          });
        }
      }
    });
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
}
