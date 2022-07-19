import { AddStudentToGroupComponent } from '../group-detail/add-student-to-group/add-student-to-group.component';
import { ClassCreationEditDialogComponent } from './class-creation-edit-dialog/class-creation-edit-dialog.component';
import { Router } from '@angular/router';
import { Group } from '../model/group.model';
import { TableActionButton } from 'src/app/@core/interfaces';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '../../../shared/common.constant';
import { Component, OnInit } from '@angular/core';
import { TableField } from 'src/app/shared/tree-table/tree-table.interface';
import { ClassListItem } from '../model/class-list-item.model';
import { ClassManagementService, ClassParams } from '../service/class-management.service';
import { DATATABLE_ACTIONS } from 'src/app/@core/constants';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  private _totalCount = 0;
  private _tableFields: TableField[] = [
    {
      header: this.transtale.instant('class_name'),
      fieldName: 'title',
      isFilter: true,

    },
    {
      header: 'Open Date',
      fieldName: 'openTime',
      compare: (a: any, b: any) => (new Date(b.openTime).getTime()) - (new Date(a.openTime).getTime()),
      priority: 1
    },
    {
      header: 'Number of Students',
      fieldName: 'studentCount',
      compare: (a: any, b: any) => a.studentCount - b.studentCount,
      priority: 2
    },
    {
      header: 'Number of Groups',
      fieldName: 'numberOfGroup',
      compare: (a: any, b: any) => a.numberOfGroup - b.numberOfGroup,
      priority: 3
    },
  ];
  private _actionButtons: TableActionButton[] = [
    {
        title: this.transtale.instant('delete'),
        hasPermission: true,
        action: DATATABLE_ACTIONS.DELETE,
    },
  ];
  private _data: ClassListItem[] = [];
  private _pageIndex = DEFAULT_PAGE_INDEX;
  private _pageSize = DEFAULT_PAGE_SIZE;
  private _loading: boolean = false;
  private _filterForm: FormGroup;
  private _filterOn: boolean = false;
  private _appliedFilterValue: {
    className: string;
    date: Date[];
  } = {
    className: '',
    date: []
  }

  constructor(
    private _classManagementService: ClassManagementService,
    private _router: Router,
    private transtale: TranslateService,
    private _formBuilder: FormBuilder,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._filterForm = this._formBuilder.group({
      date: [this._appliedFilterValue.date],
      className: [this._appliedFilterValue.className]
    });
    this._loadData();
  }

  get tableFields(): TableField[] {
    return this._tableFields;
  }

  get listOfData(): any {
    return this._data;
  }

  get actionButtons(): TableActionButton[] {
    return this._actionButtons;
  }

  get filterForm(): FormGroup {
    return this._filterForm;
  }

  get filterOn(): boolean {
    return this._filterOn;
  }

  get isFilterApplicable(): boolean {
    return this._filterForm.get('date').value !== this._appliedFilterValue.date
      || this._filterForm.get('className').value !== this._appliedFilterValue.className;
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

  public clearFilter(): void {
    this._filterForm.setValue({
      date: '',
      className: ''
    });
  }

  public submitForm(): void {
    this._loadData();
  }

  public toggleFilter(): void {
    this._filterOn = !this._filterOn;
  }

  public onHandleChosenActivity(item: any): void {
    if (item.children) {
      this._router.navigate(['class/class-detail', item.id]);
    } else {
      this._router.navigate(['class/group-detail', item.id]);
    }
  }

  public onHandleAction(event: {
    action: DATATABLE_ACTIONS,
    item: Group
  }): void {
    switch (event.action) {
      case DATATABLE_ACTIONS.DELETE: this._deleteGroup(event.item); return;
      case DATATABLE_ACTIONS.EDIT: return;
      default: return;
    }
  }

  public onQueryParams(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this._pageSize = pageSize;
    this._pageIndex = pageIndex;
    this._loadData();
  }

  public onAddClass(): void {
    this._dialog.open(ClassCreationEditDialogComponent).afterClosed().subscribe(
      (data) => {
        if (data) {
          this._loadData();
        }
      }
    );
  }

  private _deleteGroup(item: Group): void {
    this._classManagementService.deleteGroup(item.groupUniqId).subscribe(
      () =>  this._loadData()
    );
  }

  private _loadData(): void {
    this._appliedFilterValue = this._filterForm.value;
    let params: ClassParams = {};
    if (this._appliedFilterValue.className) {
      params.title = this._appliedFilterValue.className;
    }
    if (this._appliedFilterValue.date.length === 2) {
      params.openDateFrom = this._appliedFilterValue.date[0].toISOString();
      params.openDateTo = this._appliedFilterValue.date[1].toISOString();
    }
    this._loading = true;
    this._classManagementService.getClassList(this._pageIndex, this._pageSize, true, params).subscribe(
      data => {
        this._data = data.content;
        this._totalCount = data.totalCount;
        this._loading = false;
      },
      _error => this._loading = false
    );
  }
}
