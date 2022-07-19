import { StudentListItem } from '../model/student.model';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@app/shared/common.constant';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TranslateService } from '@ngx-translate/core';
import { TreeTableInterface } from '@app/shared/tree-table/tree-table.interface';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  @Input() listOfMapData: readonly StudentListItem[] = [];
  @Input() isGroupDetail: boolean = false;
  @Input() loading: boolean = false;
  @Input() total: number = 0;
  @Input() pageSize: number = DEFAULT_PAGE_SIZE;
  @Input() pageIndex: number = DEFAULT_PAGE_INDEX;
  @Input() isServerSide: boolean = false;
  @Input() yScrollSize: string = 'calc(100vh - 340px)';
  @Output() itemChecked$: EventEmitter<string[]> = new EventEmitter();
  @Output() onQueryParams: EventEmitter<NzTableQueryParams> = new EventEmitter;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  configSearchCols: any = {};
  configWidthCols: any = [];
  listOfDisplayData: any = [];
  listGroup: any = {
    chinese: [],
    english: []
  };
  tableFields = [
    {
      header: this.transtale.instant('tbl.id'),
      fieldName: 'id',
    },
    {
      header: this.transtale.instant('tbl.chineseName'),
      fieldName: 'fullNameChinese',
    },
    {
      header: this.transtale.instant('tbl.englishName'),
      fieldName: 'fullNameEnglish',
    },
    {
      header: this.transtale.instant('tbl.email'),
      fieldName: 'email',
    },
    {
      header: this.transtale.instant('tbl.phone'),
      fieldName: 'phone',
    },
    {
      header: this.transtale.instant('tbl.group'),
      fieldName: 'group',
    },
  ];
  constructor(
    private transtale: TranslateService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['listOfMapData']?.currentValue) {
      this.listOfMapData = changes['listOfMapData'].currentValue;
      this.resetSearch(this.tableFields[0].fieldName);
    }
  }
  ngOnInit(): void {
    if (this.isGroupDetail) {
      this.tableFields = this.tableFields.filter(field => field.fieldName !== 'group');
    } else {
      this.listOfMapData.forEach(stu => {
        if (stu.groups.length > 0) {
          stu.groups.forEach(group => {
            this.listGroup.chinese.push(group.titleChinese);
            this.listGroup.english.push(group.titleEnglish);
          });
        }
      })
      this.listGroup.chinese = this.listGroup.chinese.filter(function (value, index, array) {
        return array.indexOf(value) === index;
      });
      this.listGroup.english = this.listGroup.english.filter(function (value, index, array) {
        return array.indexOf(value) === index;
      });
    }
    this.configWidthCols[0] = '100px';
    this.tableFields.forEach(field => {
      if (field.fieldName !== 'group') {
        this.configSearchCols[field.fieldName] = {
          searchVisible: false,
          searchValue: ''
        }
      }
    })
  }

  public reloadTable(data: StudentListItem[]): void {
    this.listOfMapData = data;
    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();
  }

  public updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  public onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.itemChecked$.next(Array.from(this.setOfCheckedId));
  }

  public onAllChecked(value: boolean): void {
    this.listOfMapData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
    this.itemChecked$.next(Array.from(this.setOfCheckedId));
  }

  public onCurrentPageDataChange($event: readonly StudentListItem[]): void {
    this.listOfMapData = $event;
    this.refreshCheckedStatus();
  }

  public onQueryParamsChange(params: NzTableQueryParams) {
    this.onQueryParams.next(params);
  }

  public refreshCheckedStatus(): void {
    // this.checked = this.listOfMapData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfMapData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
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
}
