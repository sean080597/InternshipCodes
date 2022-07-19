import { MoveStudentGroupDialogComponent } from './move-student-group-dialog/move-student-group-dialog.component';
import { Component, OnInit } from '@angular/core';
import { StudentListItem } from '../model/student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassManagementService } from '../service/class-management.service';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@app/shared/common.constant';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RemoveStudentGroupDialogComponent } from './remove-student-group-dialog/remove-student-group-dialog.component';
import { AddStudentToGroupComponent } from './add-student-to-group/add-student-to-group.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
  private _group: any;
  private _data: StudentListItem[] = [];
  private _selectedStudents: StudentListItem[] = [];
  private _pageIndex = DEFAULT_PAGE_INDEX;
  private _pageSize = DEFAULT_PAGE_SIZE;
  private _loading: boolean = false;
  private _totalCount = 0;
  groupID: string = '';
  groupItem: any = {};
  studentList = [];
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _classManagementService: ClassManagementService,
    private modalService: NzModalService,
    private translateService: TranslateService,
    private msg: NzMessageService,
  ) {
    this.groupID = this._activatedRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this._classManagementService.getGroupDetail(this.groupID).subscribe(res => {
      if (res.data) {
        this.groupItem = res.data;
        this._loadData()
      } else {
        this._router.navigate(['/class']);
      }
    });
  }

  get listOfData(): any {
    return this._data;
  }

  get selectedStudents(): StudentListItem[] {
    return this._selectedStudents;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  get total(): number {
    return this._totalCount;
  }

  get loading(): boolean {
    return this._loading;
  }

  public onHandleItemCheck(ids: string[]): void {
    let selected: StudentListItem[] = [];
    this._data.forEach(
      (studentItem) => {
        if (ids.find(id => id === studentItem.id)) {
          selected.push(studentItem);
        }
      }
    );
    this._selectedStudents = selected;
  }

  public openMoveStudentToGroup(): void {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('select_group_to_move'),
      nzWidth: '700px',
      nzContent: MoveStudentGroupDialogComponent,
      nzComponentParams: {
        data: this._group
      }
    });
    modal.afterClose.subscribe(result => {
      if (result.isSubmit) {
        if (result.data) {
          const studentIds = this._selectedStudents.map(item => item.id);
          this._classManagementService.moveStudentToGroup(this.groupItem?.groupUniqId, result.data, studentIds).subscribe(
            () => {
              this.msg.success(this.translateService.instant('move_student_to_other_group_successful'));
              this._loadData()
            }
          );
        }
      }
    });
  }

  public openRemoveStudentFromGroup(): void {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('delete_student_confirm'),
      nzWidth: '700px',
      nzContent: RemoveStudentGroupDialogComponent,
    });
    modal.afterClose.subscribe(result => {
      if (result.isSubmit) {
        const studentIds = this._selectedStudents.map(item => item.id);
        this._classManagementService.removeStudentFromGroup(this.groupItem?.groupUniqId, studentIds).subscribe(
          () => this._loadData()
        );
      }
    });
  }

  public openAddStudentToGroup(): void {
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('add_student'),
      nzWidth: '1800px',
      nzContent: AddStudentToGroupComponent,
      nzComponentParams: {
        data: this.groupItem,
        studentList: this.studentList
      }
    });
    modal.afterClose.subscribe(result => {
      if (result?.isSubmit) {
        const studentIds = result.selectedStudent.map(item => item.id);
        this._classManagementService.removeStudentFromGroup(this._group.id, studentIds).subscribe(
          () => this._loadData()
        );
      }
    });
  }

  public onQueryParams(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this._pageSize = pageSize;
    this._pageIndex = pageIndex;
    this._loadData();
  }

  private _loadData(): void {
    this._loading = true;
    this._selectedStudents = [];
    if (this.groupItem?.groupUniqId !== undefined) {
      this._classManagementService.getStudentListByGroupId(this.groupItem?.groupUniqId || null, this._pageIndex, this._pageSize).subscribe(
        data => {
          this._data = data.content;
          this._totalCount = data.totalCount;
          this._loading = false;
        },
        _error => this._loading = false
      );
      this.getAllStudentByGroupID();
    }
  }

  getAllStudentByGroupID() {
    this._classManagementService.getStudentListByGroupId(this.groupID, 1, 1000).subscribe(
      (groupData) => {
        // this.studentList = groupData.content;
        groupData.content.forEach((item, index) => {
          this.studentList.push({
            key: item.id,
            title: item.fullName,
            checked: false,
            classUniqId: item.classUniqId,
            email: item.email,
            fullName: item.fullName,
            fullNameChinese: item.fullNameChinese,
            fullNameEnglish: item.fullNameEnglish,
            group: item.group,
            groupUniqId: item.groupUniqId,
            groups: item.groups,
            id: item.id,
            phone: item.phone,
          });
        })
      },
    );
  }
}
