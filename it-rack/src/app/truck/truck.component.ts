import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RemarkType, TrackingRemark } from '@shared/components/tracking-remark/tracking-remark.model';
import { FILTER_TYPES, LAYOUT_TYPES, SNACKBAR_DURATION, ViewType, SUMMARY_WIDGETS } from '@shared/constants';
import { LoadOptions } from 'devextreme/data/load_options';
import {
  ActiveViewResponseBody,
  Change,
  FilterDataResponseBody,
  SummaryWidgetData,
  TruckTracking,
  TruckTrackingMilestones,
  TruckTrackingRequestBody,
  TruckTrackingResponseBody,
  TruckTrackingStatus,
  TruckViewSource,
} from './truck.model';
import { TruckService } from './truck.service';
import { DevExtremeService } from '@shared/dev-extreme.service';
import { DxDataGridComponent, DxTooltipComponent } from 'devextreme-angular';
import { FavoriteService } from '@app/favourite/favorite/favorite.service';
import { DxDataSortOption, GeneralResponseBody } from '@shared/shared.model';
import DxDataGrid from 'devextreme/ui/data_grid';
import moment from 'moment';
import DataSource from 'devextreme/data/data_source';
import { Router } from '@angular/router';
import { NavigationService } from '@app/favourite/navigation/navigation.service';
import { on } from 'devextreme/events';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as screenfull from 'screenfull';
import { SharedService } from '@app/shared/shared.service';

@Component({
  selector: 'app-truck',
  templateUrl: './truck.component.html',
  styleUrls: ['./truck.component.scss'],
})
export class TruckComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
  @ViewChild('SummaryWidgets')
  summaryWidgetsRef: ElementRef;
  @ViewChild('ShippingPointTooltip') tooltip: DxTooltipComponent;

  public truckTrackingDataSource: DataSource;
  public remarks: TrackingRemark[] = [];
  public remarkType = RemarkType.Truck;
  public dateFormat = 'yyyy/MM/dd HH:mm';
  public dateFormatMoment = 'YYYY/MM/DD HH:mm';
  public dateFormatReq = 'YYYY-MM-DD HH:mm';
  public dateFormatFilterRow = 'yyyy/MM/dd';
  public isShowingRemark = false;
  public isShowingSharingModal = false;
  public selectedShipmentNumber: string;
  public viewId = ViewType.truckView;
  public selectedTracking: TruckTracking;
  public truckTrackingStatus = TruckTrackingStatus;
  public milestonesFilterSource: { text: string; value: number }[] = [];
  public opCodeFilterSource: { text: string; value: string }[] = [];
  public lspFilterSource: { text: string; value: string }[] = [];
  public transTypeFilterSource: { text: string; value: string }[] = [];
  public userId: number = 0;
  public role = 0;
  public isAllowUpdate = false;
  private adminRole = [5, 7, 9];
  public changes: Change<{ requiredDeliveryDate: string }>[] = [];
  public isProgressVisible = false;
  public isBuilderVisible = false;
  public shippingPointsDesc: Object;
  public isPopupManageViewVisible = false;
  public columnSettings: string[] = [];
  public pageReqManageView: DxDataSortOption[];
  public filterValue: string = '';
  public activeFilterValue: Array<any> = [];
  public activeVisibleColumns: string[] = [];
  public activeSortColumns: Array<any> = [];
  public summaryWidgetsTitle: string[] = SUMMARY_WIDGETS;
  public summaryWidgets: Array<SummaryWidgetData> = [];
  public isShipmentLogsVisible = false;
  public shipmentLogData: TruckTracking;
  public tooltipSub: BehaviorSubject<string> = new BehaviorSubject('No data');
  public isSortingColumns = false;
  public isFullscreen = false;
  public isShowSummaryWidgets = true;
  public exportLoadOptions: LoadOptions = {};
  observer: MutationObserver;
  intervalAutoGetWidgets;
  viewSourceFilter: TruckViewSource;

  constructor(
    private truckService: TruckService,
    private favoriteService: FavoriteService,
    private dxService: DevExtremeService,
    private snackBar: MatSnackBar,
    private router: Router,
    private navigationService: NavigationService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    if (screenfull.isEnabled) {
      screenfull.onchange(() => {
        this.isFullscreen = (screenfull as screenfull.Screenfull).isFullscreen;
      });
    }
    this.navigationService.pathStatus.emit('truck');
    this.userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    this.role = JSON.parse(localStorage.getItem('currentUser')).role;
    this.isAllowUpdate = this.adminRole.includes(this.role);
    this.initFilterDataSource();
    this.initShippingPoints();
    this.truckService.getSummaryWidgets(this.userId).subscribe((res: Array<SummaryWidgetData>) => (this.summaryWidgets = res));
    this.initIntervalWidgets();
  }

  ngAfterViewInit(): void {
    this.getActiveView();
    this.initDataSource();
    this.dxDataGrid.filterPanel.customizeText = (evt) => {
      this.filterValue = evt.text;
    };
    this.initObserverDatePicker();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
    if (this.intervalAutoGetWidgets) {
      clearInterval(this.intervalAutoGetWidgets);
    }
  }

  public handleRowClick(e) {
    if (e.rowType == 'data' && e.column.dataField == 'shipmentNumber') {
      this.router.navigate(['/truck/truck-detail/' + encodeURIComponent(e.data.shipmentNumber)]);
    }
  }

  onEditingStart(e: any): void {
    e.cancel = !(this.isAllowUpdate && e.data.requiredDeliveryDate !== '');
  }

  onSaving(e) {
    e.cancel = true;

    if (e.changes.length) {
      e.promise = this.processBatchRequest(e.changes, e.component);
    }
  }

  async processBatchRequest(changes: Array<Change<{ requiredDeliveryDate: string }>>, component: DxDataGrid): Promise<any> {
    changes.forEach((change) => {
      const formatDate = moment(change.data.requiredDeliveryDate).format(this.dateFormatReq);
      this.truckService.updateReqDeliveryDate(change.key, formatDate).subscribe(async () => {
        //Reload data after save
        await component.refresh(true);
        component.cancelEditData();
      })
    });

  }

  public convertDate(id: number): string {
    const initVal = this.truckTrackingDataSource.items().filter((val) => val.id === id)[0];
    if (!initVal || !initVal.requiredDeliveryDate) {
      return;
    }

    return moment(initVal.requiredDeliveryDate).format(this.dateFormatMoment);
  }

  public calculateDateChange(id: number): string {
    const change = this.changes.filter((val) => val.key === id)[0];
    const initVal = this.truckTrackingDataSource.items().filter((val) => val.id === id)[0];

    if (!initVal) {
      return;
    }

    const requiredDeliveryDate = moment(initVal.requiredDeliveryDate).dayOfYear();
    const revisedReqDeliveryDate = moment(initVal.revisedReqDeliveryDate).dayOfYear();
    const changeDate = change ? moment(change.data.requiredDeliveryDate).dayOfYear() : revisedReqDeliveryDate;

    const numberChanged = changeDate - requiredDeliveryDate;

    if (numberChanged === 0 || !numberChanged) {
      return '';
    }
    if (numberChanged > 0) {
      return '(+' + numberChanged.toString() + ')';
    }
    return '(' + numberChanged.toString() + ')';
  }

  public handleToolbarPreparing(event: any): void {
    const applyFilterWidget = event.toolbarOptions.items[0];
    if (applyFilterWidget) applyFilterWidget.visible = false;

    const saveWidget = event.toolbarOptions.items[1];
    if (saveWidget) {
      saveWidget.location = 'before';
      saveWidget.visible = false;
    }

    const revertWidget = event.toolbarOptions.items[2];
    if (revertWidget) {
      revertWidget.location = 'before';
      revertWidget.visible = false;
    }

    const chooserWidget = event.toolbarOptions.items[3];
    if (chooserWidget) chooserWidget.visible = false;

    event.toolbarOptions.items.unshift(
      {
        location: 'before',
        template: 'filterTemplate',
      },
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxDropDownButton',
        options: {
          width: 100,
          text: 'Filter',
          icon: 'filter',
          hint: 'Filter',
          showArrowIcon: false,
          rtlEnabled: true,
          dropDownOptions: { width: 100 },
          items: [FILTER_TYPES.createFilter, FILTER_TYPES.cleanFilter],
          onItemClick: this.handleFilterFunctions.bind(this),
        },
      },
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxDropDownButton',
        options: {
          width: 100,
          text: 'Layout',
          icon: 'preferences',
          hint: 'Column Settings',
          showArrowIcon: false,
          rtlEnabled: true,
          dropDownOptions: { width: 110 },
          items: [LAYOUT_TYPES.setColumn, LAYOUT_TYPES.manageView],
          onItemClick: this.handleLayoutFunctions.bind(this),
        },
      },
      {
        location: 'after',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: {
          width: 100,
          icon: 'export-excel-button',
          hint: 'Export all data',
          text: 'Export',
          rtlEnabled: true,
          elementAttr: {
            class: 'dx-datagrid-export-button',
          },
          onClick: this.exportTruckTracking.bind(this),
        },
      }
    );
  }

  exportTruckTracking(evt) {
    this.openSnackBar('After a successful search, a download will be prepared in the background. Please be patient, due to the amount of data.', '');
    this.sharedService.showLoading();
    this.isProgressVisible = false;
    const requestBody = this.getTrackingRequestBody(this.exportLoadOptions);
    return this.truckService
      .getTruckTrackingExcel(requestBody)
      .pipe(
        map((response) => {
          const errorMessage = response.headers.get('Error');
          if (errorMessage) {
            this.openSnackBar(errorMessage, '');
            return;
          } else {
            return this.dxService.handleDownloadingResponse(response);
          }
        }),
        catchError(() => {
          this.openSnackBar('file download failed', '');
          return observableOf([]);
        })
      )
      .toPromise()
      .finally(() => {
        setTimeout(() => {
          this.sharedService.hideLoading();
        }, 100);
      });
  }

  public toggleFavorite(e, trackingId: number): void {
    e.stopPropagation();
    const trackingModel = this.findTrackingByShipmentId(trackingId);
    trackingModel.favorite = !trackingModel.favorite;
    this.sharedService.showLoading();
    this.favoriteService.setFavorite(trackingModel.shipmentNumber, trackingModel.favorite, ViewType.truckView).subscribe(
      (response: GeneralResponseBody) => {
        this.openSnackBar(response.message, '');
      },
      (error) => {},
      () => {
        this.sharedService.hideLoading();
      }
    );
  }

  public toggleRemark(e, trackingId: number): void {
    e.stopPropagation();
    this.selectedTracking = this.findTrackingByShipmentId(trackingId);
    this.selectedShipmentNumber = this.selectedTracking.shipmentNumber;
    this.isShowingRemark = !this.isShowingRemark;
  }

  public closeRemark(): void {
    this.isShowingRemark = false;
  }

  public openSharingModal(e, shipmentId: string): void {
    e.stopPropagation();
    this.selectedShipmentNumber = shipmentId;
    this.isShowingSharingModal = true;
  }

  openShipmentLogModal(evt, shipmentData: TruckTracking) {
    this.isShipmentLogsVisible = true;
    this.shipmentLogData = shipmentData;
  }

  public getShareStatus(): void {
    this.isShowingSharingModal = false;
  }

  public handleRemarkAdded(remarkKey: string): void {
    if (this.selectedTracking) {
      this.selectedTracking.remarked = true;
    }
  }

  public format(value) {
    return value * 100 + '%';
  }

  genDisplayModeView(loadOptions, filterReq) {
    return {
      filter: filterReq,
      sort: loadOptions?.sort ?? [],
      columns: this.dxDataGrid.instance.getVisibleColumns().map((t) => t.dataField) ?? [],
    };
  }

  private getTrackingRequestBody(loadOptions: LoadOptions): TruckTrackingRequestBody {
    this.exportLoadOptions = loadOptions;
    console.log('activeFilterValue => ', this.activeFilterValue)
    loadOptions.filter = this.activeFilterValue;
    const pageRequest = this.dxService.parsePageRequest(loadOptions);

    let filterRequest = this.dxService.parseFilterRequest(loadOptions);
    if (filterRequest.milestones && Array.isArray(filterRequest.milestones)) {
      filterRequest.milestones = filterRequest.milestones.join('+');
    }
    if (filterRequest.supplierName && Array.isArray(filterRequest.supplierName)) {
      filterRequest.supplierName = filterRequest.supplierName.join('+');
    }
    if (filterRequest.transportType && Array.isArray(filterRequest.transportType)) {
      filterRequest.transportType = filterRequest.transportType.join('+');
    }
    if (filterRequest.operatorCode && Array.isArray(filterRequest.operatorCode)) {
      filterRequest.operatorCode = filterRequest.operatorCode.join('+');
    }

    const request = {
      ...filterRequest,
      pageRequest,
    } as TruckTrackingRequestBody;

    this.viewSourceFilter = this.genDisplayModeView(loadOptions, request);

    return request;
  }

  private initDataSource(): void {
    this.truckTrackingDataSource = new DataSource({
      key: 'id',
      load: (loadOptions: LoadOptions) => {
        this.sharedService.showLoading();
        this.isProgressVisible = false;
        const requestBody = this.getTrackingRequestBody(loadOptions);
        return this.truckService
          .getTruckTrackingSummary(requestBody)
          .toPromise()
          .then((response: TruckTrackingResponseBody) => {
            return {
              data: response.data.content,
              totalCount: response.data.totalElements,
              groupCount: response.data.totalPages,
            };
          })
          .finally(() => {
            setTimeout(() => {
              const dataItem = this.truckTrackingDataSource.items();
              dataItem.forEach((data) => {
                if (data.milestones === 'In Main Carriage') {
                  this.isProgressVisible = true;
                  return;
                }
              });
              this.sharedService.hideLoading();
            }, 100);
          });
      },
    });
  }

  private initFilterDataSource(): void {
    this.truckService.getFilterData().subscribe((res: FilterDataResponseBody) => {
      this.milestonesFilterSource = res.data.milestones.map((t) => {
        return { text: t.value, value: t.key };
      });
      this.opCodeFilterSource = res.data.opCode.map((t) => {
        return { text: t, value: t };
      });
      this.lspFilterSource = res.data.lsp.map((t) => {
        return { text: t, value: t };
      });
      this.transTypeFilterSource = res.data.transType.map((t) => {
        return { text: t, value: t };
      });
    });
  }

  private initShippingPoints() {
    this.truckService
      .getShippingPointsDesc()
      .pipe(map((res: GeneralResponseBody) => (this.shippingPointsDesc = res.data)))
      .subscribe();
  }

  private initIntervalWidgets() {
    this.intervalAutoGetWidgets = setInterval(() => {
      this.truckService.getSummaryWidgets(this.userId).subscribe((res: Array<SummaryWidgetData>) => (this.summaryWidgets = res));
    }, 1800000);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: SNACKBAR_DURATION,
    });
  }

  private findTrackingByShipmentId(trackingId: number): TruckTracking {
    return this.dxDataGrid.instance
      .getDataSource()
      .items()
      .find((tracking: TruckTracking) => tracking.id === trackingId);
  }

  calculateGridHeight() {
    let summaryWidgetsHeight = 0;
    if (this.summaryWidgetsRef?.nativeElement?.offsetHeight > 0) {
      summaryWidgetsHeight = this.summaryWidgetsRef?.nativeElement?.offsetHeight;
    }
    // 100 = header(60) + home icon(~30) + padding/margin(~10)
    return window.innerHeight - summaryWidgetsHeight - 110;
  }

  cleanFilter() {
    this.dxDataGrid.instance.beginUpdate();
    this.dxDataGrid.instance.clearFilter();
    for (let i = 0; i < this.dxDataGrid.instance.columnCount(); i++) {
      this.dxDataGrid.instance.columnOption(i, 'selectedFilterOperation', undefined);
      this.dxDataGrid.instance.columnOption(i, 'sortOrder', undefined);
    }
    this.filterValue = null;
    this.activeFilterValue = [];
    this.dxService.setSelectedFilterOperationOnFilterRow(this.dxDataGrid);
    this.dxDataGrid.instance.endUpdate();
  }

  handleFilterFunctions(evt) {
    const name = evt.itemData.name || evt.itemData;
    switch (name) {
      case FILTER_TYPES.createFilter:
        this.isBuilderVisible = true;
        break;
      case FILTER_TYPES.cleanFilter:
        this.cleanFilter();
        break;
      default:
        break;
    }
  }

  handleLayoutFunctions(evt) {
    const name = evt.itemData.name || evt.itemData;
    switch (name) {
      case LAYOUT_TYPES.setColumn:
        this.dxDataGrid.instance.showColumnChooser();
        break;
      case LAYOUT_TYPES.manageView:
        const columns = this.dxDataGrid.instance.getVisibleColumns();
        this.columnSettings = columns.filter((t) => t.dataField).map((t) => t.dataField);
        this.pageReqManageView = this.truckTrackingDataSource.loadOptions().sort;
        this.isPopupManageViewVisible = true;
        break;
      default:
        break;
    }
  }

  // add tooltip for "shippingPoint" column
  onCellPrepared(evt) {
    if (evt.rowType === 'filter') {
      const editorEl = evt.cellElement.querySelector('input:not([readonly]).dx-texteditor-input');
      editorEl?.addEventListener('blur', () => {
        // evt.element.querySelector('.dx-apply-button').click()
        const visibleCols = this.dxDataGrid.instance.getVisibleColumns().map((t) => t.dataField);
        const colIdx = (<HTMLElement>editorEl).offsetParent.closest('td').getAttribute('aria-colindex');
        const filterName = visibleCols[parseInt(colIdx) - 1];
        this.dxService.callbackFilterContains(this.dxDataGrid, this.activeFilterValue, filterName, editorEl.value);
      });
    }
    if (evt.rowType === 'data' && evt.column.dataField === 'requiredDeliveryDate') {
      on(evt.cellElement, 'focusout', (arg) => {
        if (this.changes.length < 1) {
          const data = new Change<{ requiredDeliveryDate: string }>();
          data.key = evt.row.data.id;
          data.type = 'update';
          data.data = { requiredDeliveryDate: evt.value };
          this.changes.push(data);
        }
        this.processBatchRequest(this.changes, this.dxDataGrid.instance);
      });
    }
    if (evt.rowType === 'data' && evt.column.dataField === 'shippingPoint') {
      on(evt.cellElement, 'mouseover', (arg) => {
        if (arg.target.tagName === 'P') {
          this.tooltipSub.next(this.shippingPointsDesc[evt.data.shippingPoint.trim()] ?? 'No data');
          this.tooltip.instance.show(arg.target);
        }
      });

      on(evt.cellElement, 'mouseout', (arg) => {
        this.tooltip.instance.hide();
      });
    }
  }

  hidePopup(val) {
    this.isPopupManageViewVisible = val;
  }

  hideShipmentLogEvent(val) {
    this.isShipmentLogsVisible = val;
  }

  updateFilter(evt) {
    if (evt) {
      this.cleanFilter();
      this.getActiveView();
      this.dxDataGrid.instance.filter(this.activeFilterValue);
    }
  }

  getActiveView() {
    this.truckService.getActiveManageViewItem(this.userId).subscribe(async (res: ActiveViewResponseBody) => {
      if (res.data.active) {
        this.activeFilterValue = this.dxService.revertSaveDataManageView(res.data.view.filterInfo);
        this.activeVisibleColumns = res.data.view.columnList;
        this.activeSortColumns = res.data.view.sortInfo;
      } else {
        this.activeFilterValue = [];
        this.activeVisibleColumns = [];
        this.activeSortColumns = [];
      }
      this.sortFilterColumns();
    });
  }

  sortFilterColumns() {
    this.isSortingColumns = true;
    this.dxService.changeOrderColumns(this.dxDataGrid, this.activeVisibleColumns);
    this.dxService.hideColumns(this.dxDataGrid, this.activeVisibleColumns);
    this.activeSortColumns.forEach((t) => this.dxDataGrid.instance.columnOption(t.field, 'sortOrder', t.expression));
    this.isSortingColumns = false;
  }

  // handling dxTagBox filter
  onEditorPreparing(e) {
    this.dxService.initDxTagBox(e, 'milestones', this.milestonesFilterSource, this.dxDataGrid, this.isSortingColumns, this.activeFilterValue);
    this.dxService.initDxTagBox(e, 'supplierName', this.lspFilterSource, this.dxDataGrid, this.isSortingColumns, this.activeFilterValue);
    this.dxService.initDxTagBox(e, 'operatorCode', this.opCodeFilterSource, this.dxDataGrid, this.isSortingColumns, this.activeFilterValue);
    this.dxService.initDxTagBox(e, 'transportType', this.transTypeFilterSource, this.dxDataGrid, this.isSortingColumns, this.activeFilterValue);
    this.dxService.setNoHoverOnFilterRow(e);

    this.dxService.setTriggerDate(e, 'plannedPickupDate', this.observer);
    this.dxService.setTriggerDate(e, 'actualPickupDate', this.observer);
    this.dxService.setTriggerDate(e, 'requiredDeliveryDate', this.observer);
    this.dxService.setTriggerDate(e, 'actualDeliveryDate', this.observer);
    this.dxService.setTriggerDate(e, 'estDeliveryDate', this.observer);

    this.dxService.setDisplayDateFormat(e, 'plannedPickupDate', this.dateFormatFilterRow)
    this.dxService.setDisplayDateFormat(e, 'actualPickupDate', this.dateFormatFilterRow)
    this.dxService.setDisplayDateFormat(e, 'requiredDeliveryDate', this.dateFormatFilterRow)
    this.dxService.setDisplayDateFormat(e, 'actualDeliveryDate', this.dateFormatFilterRow)
  }

  initObserverDatePicker() {
    this.observer = new MutationObserver((mutations) => {
      const visibleCols = this.dxDataGrid.instance.getVisibleColumns().map((t) => t.dataField);
      const colIdx = (<HTMLElement>mutations[0].target).offsetParent.parentElement.getAttribute('aria-colindex');
      const filterName = visibleCols[parseInt(colIdx) - 1];
      const filterValue = (<HTMLElement>mutations[0].target).innerHTML.split('-');
      this.dxService.callbackFilterDate(this.dxDataGrid, this.activeFilterValue, filterName, filterValue[0].trim(), filterValue[1]?.trim());
    });
  }

  calculateFilterExp(filterValues, selectedFilterOperation) {
    return this.dxService?.calculateFilterExpression(filterValues, selectedFilterOperation);
  }

  isShowGPSicon(rowData) {
    return rowData.currentCity && rowData.milestones === TruckTrackingMilestones.inMainCarriage && !rowData.manualLocation;
  }

  genMilestoneColor(status: number) {
    switch (status) {
      case 1:
        return 'milestone--green';
      case 2:
        return 'milestone--yellow';
      case 3:
        return 'milestone--red';
      default:
        return 'milestone--gray';
    }
  }

  toggleFullscreen() {
    const newColumnsOrder = this.dxDataGrid.instance
      .getVisibleColumns()
      .filter((t) => t.dataField !== undefined)
      .map((t) => t.dataField);
    this.viewSourceFilter.columns = newColumnsOrder;
    const el = document.querySelector('#truck-display-mode');
    if (el && screenfull.isEnabled) {
      screenfull.toggle(el);
    }
  }
}
