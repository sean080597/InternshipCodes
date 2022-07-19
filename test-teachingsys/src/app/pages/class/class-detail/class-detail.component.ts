
import { ClassManagementService } from '../service/class-management.service';
import { ClassListItem } from '../model/class-list-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StudentListItem } from '../model/student.model';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@app/shared/common.constant';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AddStudentGroupDialogComponent } from './add-student-group-dialog/add-student-group-dialog.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss']
})
export class ClassDetailComponent implements OnInit {
  private _class: ClassListItem;
  private _data: StudentListItem[] = [];
  private _selectedStudents: StudentListItem[] = [];
  private _pageIndex = DEFAULT_PAGE_INDEX;
  private _pageSize = DEFAULT_PAGE_SIZE;
  private _loading: boolean = false;
  private _totalCount = 0;
  classID = '';
  classItem: any;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private modalService: NzModalService,
    private _classManagementService: ClassManagementService
  ) {
    this.classID = this._activatedRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    // const classItem = JSON.parse(this._activatedRoute.snapshot.paramMap.get('class')) as ClassListItem;
    // if (classItem) {
    //   this._class = classItem;
    // } else {
      // }
      // this._loadData();
      this._classManagementService.classDetail(this.classID).subscribe(res => {
        this.classItem = res.data;
      }).add(() => {
        if (this.classItem) {
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

  public openAddStudentToGroup(): void {
    // this._dialog.open(AddStudentGroupDialogComponent, {
    //   data: this._selectedStudents
    // }).afterClosed().subscribe(
    //   (data: Group | string) => {
    //     if (data) {
    //       const id = (data instanceof Group) ? data.groupUniqId : data;
    //       const studentIds = this._selectedStudents.map(item => item.id);
    //       this._classManagementService.addStudentToGroup(id, studentIds).subscribe(
    //         () => this._loadData()
    //       );
    //     }
    //   }
    // );
    const modal = this.modalService.create({
      nzTitle: this.translateService.instant('add_student_to_group'),
      nzWidth: '1000px',
      nzContent: AddStudentGroupDialogComponent,
      nzComponentParams: {
        data: this._selectedStudents
      }
    });
    modal.afterClose.subscribe(result => {
      if (result.isSubmit) {
        console.log(result)
        const studentIds = this._selectedStudents.map(item => item.id);
        this._classManagementService.addStudentToGroup(result.selectedGroup, studentIds).subscribe(
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
    this._classManagementService.getStudentListByClassId(this._pageIndex, this._pageSize, this.classID).subscribe(
      data => {
        this._data = data.content;
        this._totalCount = data.totalCount;
        this._loading = false;
      },
      _error => this._loading = false
    );
  }
}
