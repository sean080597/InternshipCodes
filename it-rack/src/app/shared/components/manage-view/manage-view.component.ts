import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { ManageViewItem, ManageViewRequestBody, ManageViewResponseBody, SortInfo } from '../../../truck/truck.model';
import { TruckService } from '../../../truck/truck.service';
import { finalize, map } from 'rxjs/operators';
import { MAXIMUM_CONDITIONS } from '@app/shared/constants';
import notify from 'devextreme/ui/notify';
import ArrayStore from 'devextreme/data/array_store';
import RadioBtnGroup from 'devextreme/ui/radio_group';
import { DevExtremeService } from '@app/shared/dev-extreme.service';
import { DxDataSortOption } from '@app/shared/shared.model';

@Component({
  selector: 'app-manage-view',
  templateUrl: './manage-view.component.html',
  styleUrls: ['./manage-view.component.scss'],
})
export class ManageViewComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
  @ViewChild('DatagridContainer')
  datagridContainerRef: ElementRef;

  @Input() isPopupManageViewVisible: boolean = false;
  @Input() conditionsArray: Array<any> = [];
  @Input() columnSettings: string[] = [];
  @Input() pageReq: DxDataSortOption[] = [];
  @Output() hidePopupEvent = new EventEmitter();
  @Output() updateFilterEvent = new EventEmitter();

  dataSource: ArrayStore;
  manageViewItems: ManageViewItem[];
  selectedValue: number | undefined;
  userId: number = JSON.parse(localStorage.getItem('currentUser'))?.id;

  constructor(private truckService: TruckService, private dxService: DevExtremeService) {}

  ngOnInit(): void {
    console.log('conditionsArray => ', this.conditionsArray)
    this.initManageViewDataSource();
  }

  genWidth() {
    return window.innerWidth / 2;
  }

  genHeight() {
    return this.datagridContainerRef?.nativeElement?.offsetHeight + 100;
  }

  initManageViewDataSource() {
    this.truckService
      .getManageViewList(this.userId)
      .pipe(map((res: ManageViewResponseBody) => res.data))
      .subscribe((res) => {
        this.manageViewItems = res;
        this.dataSource = new ArrayStore({ key: 'id', data: res });
        this.selectedValue = res.find((t) => t.status === 1)?.id;
      });
  }

  checkIfAddingRow() {
    if (this.manageViewItems?.length < MAXIMUM_CONDITIONS) {
      this.dxDataGrid?.instance?.addRow();
    }
  }

  // remove dx-focused class
  onFocusedCellChanging(evt) {
    evt.isHighlighted = false;
  }

  onRowClick(evt) {
    if (this.manageViewItems.some((t) => t.id === evt.key)) {
      this.truckService.updateActiveCondition(this.userId, evt.key).subscribe(() => this.initManageViewDataSource());
      this.selectedValue = evt.key;
      evt.component.selectRows([evt.key], false);
    }
  }

  onCellPrepared(evt) {
    if (evt.rowType === 'data' && evt.columnIndex === 0 && evt.rowIndex === 0 && !this.manageViewItems.some((t) => t.id === evt.key)) {
      const radioInstance = RadioBtnGroup.getInstance(evt.cellElement.querySelector('dx-radio-group'));
      radioInstance.option('disabled', true);
    }
  }

  onEditorPreparing(evt) {
    if (evt.parentType == 'dataRow') {
      evt.editorOptions.placeholder = evt.dataField == 'viewName' ? 'Name' : 'Description';
    }
  }

  hidePopup() {
    this.updateFilterEvent.emit(true);
    this.hidePopupEvent.emit(false);
  }

  canAddRow(evt) {
    if (
      !evt.newData.viewName ||
      !evt.newData.viewDesc ||
      this.manageViewItems.length >= MAXIMUM_CONDITIONS ||
      this.manageViewItems.some((t) => t.viewName === evt.newData.viewName)
    ) {
      evt.isValid = false;
      if (this.manageViewItems.length >= MAXIMUM_CONDITIONS) {
        evt.errorText = 'Cannot exceed 5 conditions';
      } else if (!evt.newData.viewName || !evt.newData.viewDesc) {
        evt.errorText = 'Name or Description cannot be blank';
      } else if (this.manageViewItems.some((t) => t.viewName === evt.newData.viewName)) {
        evt.errorText = 'This combination is existed';
      }
    } else {
      evt.isValid = true;
    }
  }

  handleCreate(evt) {
    const filterInfo = this.dxService.convertSaveDataManageView(this.conditionsArray);

    const sortInfo = this.pageReq
      ? this.pageReq.map((t) => {
          const tmp: SortInfo = { field: t.selector, expression: t.desc ? 'desc' : 'asc' };
          return tmp;
        })
      : [];

    const reqData: ManageViewRequestBody = {
      userId: this.userId,
      viewName: evt.data.viewName,
      viewDesc: evt.data.viewDesc,
      columnList: this.columnSettings,
      filterInfo: this.dxService.genFilterInfoList(filterInfo),
      sortInfo: sortInfo,
    };
    this.dxDataGrid.instance.beginCustomLoading('Loading...');
    this.truckService
      .createManageViewItem(reqData)
      .pipe(
        finalize(() => {
          this.dxDataGrid.instance.endCustomLoading();
        })
      )
      .subscribe((res: ManageViewResponseBody) => {
        this.initManageViewDataSource();
        notify({ message: res.message, width: 'auto' }, 'info', 1000);
      });
  }

  handleDelete(evt) {
    this.dxDataGrid.instance.beginCustomLoading('Loading...');
    this.truckService
      .deleteManageViewItem(evt.data.id)
      .pipe(
        finalize(() => {
          this.dxDataGrid.instance.endCustomLoading();
        })
      )
      .subscribe((res: ManageViewResponseBody) => {
        this.initManageViewDataSource();
        notify({ message: res.message, width: 'auto' }, 'info', 1000);
      });
  }
}
