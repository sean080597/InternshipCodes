import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Filter } from '@app/@core/interfaces';
import { User } from '@app/@core/models/user';
import { UserService } from '@app/@core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit, AfterViewInit {
  public tableHeight!: number;
  @ViewChild('tableContainer') _tableContainer!: ElementRef;

  loading = false
  filterTeacher: Filter
  dataSet: User[] = []
  configSearchCols: any = {};
  listOfDisplayData: any = [];
  tableFields = [
    {
      header: this.translateService.instant('tbl.id'),
      fieldName: 'number',
    },
    {
      header: this.translateService.instant('tbl.chineseName'),
      fieldName: 'userNameChi',
    },
    {
      header: this.translateService.instant('tbl.englishName'),
      fieldName: 'userNameEng',
    },
    {
      header: this.translateService.instant('tbl.email'),
      fieldName: 'email',
    },
    {
      header: this.translateService.instant('tbl.phone'),
      fieldName: 'phoneNumber',
    }
  ];

  constructor(
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this.filterTeacher = this.userService.filterTeacher
  }

  ngOnInit(): void {
    this.tableFields.forEach(field => {
      this.configSearchCols[field.fieldName] = {
          searchVisible: false,
          searchValue: ''
      }
    })
    this.searchData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.tableHeight = this._tableContainer.nativeElement.clientHeight - 140, 100)
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.filterTeacher.pageIndex = 1
    }
    this.loading = true
    const filter = this.userService.buildFilter(this.filterTeacher)
    this.userService.getAllTeachers(filter)
      .pipe(first(), finalize(() => this.loading = false))
      .subscribe(res => {
        console.log(res)
        this.filterTeacher.totalCount = res.totalCount
        this.dataSet = res.data || []
      }).add(() => {
        this.resetSearch(this.tableFields[0].fieldName);
      });
  }

  onEdit(student) {
    this.userService.openEditModal(student, this.translateService.instant('edit_user'), (res) => this.searchData(true))
  }

  onDelete(studentId: string) {
    const title = this.translateService.instant('delete_confirm_title')
    const content = this.translateService.instant('delete_confirm_content')
    this.userService.openDeleteModal(studentId, title, content, (res) => this.searchData(true))
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
    this.listOfDisplayData = this.dataSet.filter((item) => {
        return item[fieldName]?.indexOf(this.configSearchCols[fieldName].searchValue) !== -1;
    });
}
}
