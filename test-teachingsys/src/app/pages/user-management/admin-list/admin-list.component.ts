import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@app/@core/services/user.service';
import { finalize, first } from 'rxjs';
import { User } from '@app/@core/models/user';
import { TranslateService } from '@ngx-translate/core';
import { Filter } from '@app/@core/interfaces';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit, AfterViewInit {
  public tableHeight!: number;
  @ViewChild('tableContainer') _tableContainer!: ElementRef;

  loading = false
  filterAdmin: Filter
  dataSet: User[] = []
  configSearchCols: any = {};
  listOfDisplayData: any = [];
  tableFields = [
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
    this.filterAdmin = this.userService.filterAdmin
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
      this.filterAdmin.pageIndex = 1
    }
    this.loading = true
    const filter = this.userService.buildFilter(this.filterAdmin)
    this.userService.getAllAdmins(filter)
      .pipe(first(), finalize(() => this.loading = false))
      .subscribe(res => {
        this.filterAdmin.totalCount = res.totalCount
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
