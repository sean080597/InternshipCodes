import { GradeService } from './../service/grade.service';
import { Router } from '@angular/router';
import { of, delay } from 'rxjs';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from './../../../shared/common.constant';
import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FieldConfig, GradeListItem } from '../model/grade-list';

const DELAY_TIME = 1000;
const TABLE_CONFIG: FieldConfig[] = [
  {
    header: 'Task',
    fieldName: 'task',
    width: '',
    filter: {
      filterVisible: true,
      searchValue: '',
      searchVisible: false
    }
  },
  {
    header: 'Learning Activity',
    fieldName: 'learningActivity',
    width: '',
    filter: {
      filterVisible: true,
      searchValue: '',
      searchVisible: false
    }
  },
  {
    header: 'Final Grade',
    fieldName: 'finalGrade',
    width: '200px',
    filter: {
      filterVisible: false,
      searchValue: '',
      searchVisible: false
    }
  }
];

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss']
})
export class GradeListComponent implements OnInit{
  private _data: GradeListItem[] = [];
  private _loading: boolean = false;
  private _total: number = 0;
  private _pageSize: number = DEFAULT_PAGE_SIZE;
  private _pageIndex: number = DEFAULT_PAGE_INDEX;
  private _tableConfig: FieldConfig[] = TABLE_CONFIG;
  private _displayData: GradeListItem[] = [];

  constructor(
    private _router: Router,
    private _gradeService: GradeService
  ) { }

  ngOnInit(): void {
    this._loadData();
  }

  public get data(): GradeListItem[] {
    return this._data;
  }

  public get displayData(): GradeListItem[] {
    return this._displayData;
  }

  public get loading(): boolean {
    return this._loading;
  }

  public get total(): number {
    return this._total;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  public get tableConfig(): FieldConfig[] {
    return this._tableConfig;
  }

  public onQueryParamsChange(params: NzTableQueryParams) {
    const { pageSize, pageIndex } = params;
    this._pageSize = pageSize;
    this._pageIndex = pageIndex;
    this._loadData();
  }

  public resetSearch(field: FieldConfig): void {
    field.filter.searchValue = ''
    this.search(field);
  }

  public search(field: FieldConfig): void {
    field.filter.searchVisible = false;
    const data = this._data.filter(
      (item) => {
        return !item[field.fieldName]?.indexOf(field.filter.searchValue);
      }
    );
    this._loadData(data);
  }

  public showDetail(item: GradeListItem): void {
    this._router.navigate(['/grade/grade-detail', { grade: JSON.stringify(item) }]);
  }

  private _loadData(data?: GradeListItem[]): void {
    this._loading = true;
    if (data) {
      of(data).pipe(
        delay(DELAY_TIME)
      ).subscribe(
        data => {
          this._displayData = data;
          this._loading = false;
        }
      );
    }
    else {
      this._tableConfig.forEach(
        config => {
          config.filter.searchValue = '';
        }
      );
      this._gradeService.getGradeList(this._pageIndex, this._pageSize).subscribe(
        (data) => {
          this._data = data.content;
          this._total = data.totalCount;
          this._displayData = this._data;
          this._loading = false;
        },
        () => this._loading = false
      );
    }
  }
}
