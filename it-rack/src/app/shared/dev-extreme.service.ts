import { Injectable } from '@angular/core';
import { LoadOptions } from 'devextreme/data/load_options';
import moment from 'moment';
import { EXCEPT_COLUMNS, MULTI_SORT_DELIMITER } from './constants';
import { DxDataSortOption, FilterProperties, PageRequest } from './shared.model';
import { DATE_PROPERTY_MAPPER, FilterInfo } from '@app/truck/truck.model';
import { DxDataGridComponent } from 'devextreme-angular';
import _ from 'lodash';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DevExtremeService {
  private dataTimeFormat = 'YYYY-MM-DD HH:mm';

  constructor() {}

  public parsePageRequest(loadOptions: LoadOptions): PageRequest {
    const pageRequest: PageRequest = {
      pageIndex: loadOptions.skip / loadOptions.take + 1,
      pageSize: loadOptions.take,
      sortName: loadOptions.sort?.map((sortOption: DxDataSortOption) => sortOption.selector).join(MULTI_SORT_DELIMITER),
      sortExpression: loadOptions.sort?.map((sortOption: DxDataSortOption) => (sortOption.desc ? 'desc' : 'asc')).join(MULTI_SORT_DELIMITER),
    };
    return pageRequest;
  }

  public parseFilterRequest(loadOptions: LoadOptions): FilterProperties {
    let properties = {};
    this.parseFilterOptions(loadOptions.filter, properties);
    return properties;
  }

  private parseFilterOptions(filterOptions: any[], properties: FilterProperties): void {
    if (!filterOptions) {
      return;
    }
    if (this.isBinaryFilter(filterOptions)) {
      // ["shipmentNumber","contains","123"]
      let name = filterOptions[0];
      const operator = filterOptions[1];
      let value = filterOptions[2];

      if (DATE_PROPERTY_MAPPER[name]) {
        const dateMapper = DATE_PROPERTY_MAPPER[name];
        value = moment(value).format(this.dataTimeFormat);
        if (operator === '>=') {
          name = dateMapper.from;
        } else if (operator === '<') {
          name = dateMapper.to;
        }
      }

      if (properties[name]) {
        properties[name] = `${properties[name]}+${value}`;
      } else {
        properties[name] = value;
      }
    } else if (typeof filterOptions.forEach === 'function') {
      filterOptions.forEach((options: any) => {
        this.parseFilterOptions(options, properties);
      });
    }
  }

  private isBinaryFilter(filterOptions: any[]): boolean {
    return filterOptions ? filterOptions.length === 3 && typeof filterOptions !== 'string' && typeof filterOptions[0] === 'string' : false;
  }

  // generate body to send to BE
  genFilterInfoList(conditionsArray: Array<any>) {
    let result: FilterInfo[] = [];
    if (conditionsArray && conditionsArray.length > 0) {
      // in case have only one filterValue
      if (!conditionsArray.some((t) => t === 'and')) {
        const isAllString = conditionsArray.every((t) => typeof t === 'string')
        const filterInfo: FilterInfo = {field: '', operator: '', value: ''}
        filterInfo.field = isAllString ? conditionsArray[0] : conditionsArray[0][0]
        filterInfo.operator = btoa(isAllString ? conditionsArray[1] : conditionsArray[0][1])
        filterInfo.value = isAllString ? conditionsArray[2] : conditionsArray[0][2]
        result.push(filterInfo);
      }
      // in case have multiple filterValues
      else {
        conditionsArray.forEach((el) => {
          if (Array.isArray(el)) {
            if (el.every((t) => typeof t === 'string')) {
              const filterInfo: FilterInfo = { field: el[0], operator: btoa(el[1]), value: el[2] };
              result.push(filterInfo);
            } else if (el.some((t) => Array.isArray(t))) {
              const recur = this.genFilterInfoList(el);
              result = result.concat(recur);
            }
          }
        });
      }
    }
    return result;
  }

  // generate data from BE response body
  genFilterConditions(filterInfoList: FilterInfo[]) {
    const mapped = filterInfoList.map((t) => [t.field, atob(t.operator), t.value]);
    return this.recursiveInsert(mapped);
  }

  // insert 'and' into between each pair of conditions
  private recursiveInsert(arr: Array<any>) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].some((t) => Array.isArray(t))) {
        result.push(arr[i]);
      }
      if (i !== arr.length - 1) {
        result.push('and');
      }
      if (arr[i].some((t) => Array.isArray(t))) {
        const recur = this.recursiveInsert(arr[i]);
        result.push(recur);
      }
    }
    return result;
  }

  // handling dxTagBox filter
  async initDxTagBox(
    e,
    fieldName: string,
    filterSource: Array<any>,
    dxDataGrid: DxDataGridComponent,
    isSortingColumns: boolean = false,
    activeFilterValue?: Array<any>
  ) {
    if (!isSortingColumns && e.dataField === fieldName && (e.parentType === 'dataRow' || e.parentType === 'filterRow')) {
      const intervalChangeIcon = setInterval(() => {
        const colIdx = dxDataGrid.instance.getVisibleColumnIndex(fieldName);
        if (colIdx === -1) {
          clearInterval(intervalChangeIcon);
        }
        const datagridEl = e.element.querySelector('.dx-datagrid-content.dx-datagrid-scroll-container:not(.dx-datagrid-content-fixed)');
        const editorElList = datagridEl?.querySelectorAll('td:not(.dx-cell-focus-disabled)');
        const editorEl = editorElList ? editorElList[colIdx]?.querySelector('.dx-editor-with-menu') : undefined;
        if (editorEl) {
          editorEl.querySelector('.dx-menu.dx-widget').classList.add('hide-search-icon');
          const selEl = editorEl.querySelector('.dx-texteditor-container');
          selEl.classList.add('filter-icon-container');
          if (!selEl.querySelector('i')) {
            let itag = document.createElement('i');
            itag.className = 'dx-icon dx-icon-filter-operation-default filter-icon';
            selEl.prepend(itag);
          }
          clearInterval(intervalChangeIcon);
        }
      }, 1000);
      e.editorName = 'dxTagBox';
      e.editorOptions.dropDownOptions = { minWidth: 200 };
      e.editorOptions.dataSource = filterSource;
      e.editorOptions.showSelectionControls = true;
      e.editorOptions.displayExpr = 'text';
      e.editorOptions.valueExpr = 'value';
      e.editorOptions.onFocusOut = () => {
        this.callbackFilter(e, dxDataGrid, activeFilterValue, filterSource, fieldName)
      }

      if(fieldName === 'milestones'){
        e.editorOptions.itemTemplate = this.itemTagboxTemplate
        e.editorOptions.value = e.value ? e.value.map(t => parseInt(t)) : []
      }else{
        e.editorOptions.value = e.value || [];
      }
    }
  }

  itemTagboxTemplate(itemData: any) {
    let color = ''
    if(itemData?.text){
      if(itemData.text.toLowerCase().includes('transportation delayed')){
        color = 'yellow'
      }else if(itemData.text.toLowerCase().includes('delayed')){
        color = 'red'
      }
    }
    return `<span class="dx-item-tagbox--${color}" title="${itemData.text}">${itemData.text}</span>`;
  }

  removeFoundValue(activeFilterValue: Array<any>, foundValue) {
    if (foundValue) {
      const foundIdx = activeFilterValue.indexOf(foundValue);
      activeFilterValue.splice(foundIdx, 1);

      const beginElNotAnd = activeFilterValue.find((t) => t !== 'and');
      activeFilterValue.splice(0, activeFilterValue.indexOf(beginElNotAnd));

      const endElNotAnd = _.findLastIndex(activeFilterValue, (v) => v !== 'and');
      activeFilterValue.splice(endElNotAnd + 1, activeFilterValue.length - 1);

      activeFilterValue.forEach((t) => {
        if (t === activeFilterValue[activeFilterValue.indexOf(t) + 1]) {
          activeFilterValue.splice(activeFilterValue.indexOf(t), 1);
        }
      });
    }
  }

  callbackFilter(e, dxDataGrid: DxDataGridComponent, activeFilterValue: Array<any>, filterSource, fieldName) {
    const filterStr = [...e.editorElement.querySelectorAll('.dx-tag .dx-tag-content span')].map((t) => filterSource.find((s) => s.text === t.innerHTML).value);

    const foundValue = activeFilterValue.find((t) => t.includes(fieldName));
    this.removeFoundValue(activeFilterValue, foundValue);

    if (filterStr && filterStr.length && filterStr.length !== filterSource.length) {
      if (activeFilterValue.length) {
        activeFilterValue.push('and');
      }
      const filterItem = [fieldName, 'contains', filterStr];
      activeFilterValue.push(filterItem);
    }

    dxDataGrid.instance.refresh();
    dxDataGrid.instance.filter(activeFilterValue);
    dxDataGrid.instance.repaint();
  }

  callbackFilterDate(dxDataGrid: DxDataGridComponent, activeFilterValue: Array<any>, fieldName: string, dateFrom: string, dateTo: string) {
    const foundValueBetween = activeFilterValue.find((t) => t.includes(fieldName) && t.includes('between'));
    const foundValueFrom = activeFilterValue.find((t) => t.includes(fieldName) && t.includes('>='));
    const foundValueTo = activeFilterValue.find((t) => t.includes(fieldName) && t.includes('<'));
    this.removeFoundValue(activeFilterValue, foundValueBetween);
    this.removeFoundValue(activeFilterValue, foundValueFrom);
    this.removeFoundValue(activeFilterValue, foundValueTo);
    if(dateFrom && dateFrom !== '&nbsp;'){
      dateFrom = [dateFrom.split(' ')[0], '00:00'].join(' ')
    }
    if(dateTo){
      dateTo = [dateTo.split(' ')[0], '23:59'].join(' ')
    }

    // if (dateFrom && dateFrom !== '&nbsp;' && !dateTo) dateTo = dateFrom;
    // if (dateTo && !dateFrom) dateFrom = dateTo;

    if (dateFrom && dateFrom !== '&nbsp;') {
      if (activeFilterValue.length) {
        activeFilterValue.push('and');
      }
      const filterItem = [fieldName, '>=', dateFrom];
      activeFilterValue.push(filterItem);
    }

    if (dateTo) {
      if (activeFilterValue.length) {
        activeFilterValue.push('and');
      }
      const filterItem = [fieldName, '<', dateTo];
      activeFilterValue.push(filterItem);
    }

    dxDataGrid.instance.refresh();
    dxDataGrid.instance.filter(activeFilterValue);
    dxDataGrid.instance.repaint();
  }

  callbackFilterContains(dxDataGrid: DxDataGridComponent, activeFilterValue: Array<any>, fieldName, fieldValue) {
    const foundValue = activeFilterValue.find((t) => t.includes(fieldName));
    this.removeFoundValue(activeFilterValue, foundValue);

    if (activeFilterValue.length) {
      activeFilterValue.push('and');
    }
    if (fieldValue) {
      const filterItem = [fieldName, 'contains', fieldValue];
      activeFilterValue.push(filterItem);
    }

    dxDataGrid.instance.refresh();
    dxDataGrid.instance.filter(activeFilterValue);
    dxDataGrid.instance.repaint();
  }
  // end handling dxTagBox filter

  setNoHoverOnFilterRow(e) {
    if (e.parentType === 'dataRow' || e.parentType === 'filterRow') {
      const intervalNohover = setInterval(() => {
        const datagridEl = [...e.element.querySelectorAll('.dx-datagrid-content.dx-datagrid-scroll-container')];
        datagridEl.forEach((grid) => {
          const editorElList = [...grid.querySelectorAll('td:not(.dx-cell-focus-disabled) .dx-filter-menu')];
          if (editorElList.every((t) => t.classList.contains('nohover'))) {
            clearInterval(intervalNohover);
          }
          if (editorElList.some((t) => !t.classList.contains('nohover'))) {
            editorElList.forEach((t) => t.classList.add('nohover'));
          }
        });
      }, 1000);
    }
  }

  setSelectedFilterOperationOnFilterRow(dxDataGrid: DxDataGridComponent) {
    const visibleColumns = dxDataGrid.instance.getVisibleColumns().map((t) => t.dataField);
    const dateColumns = visibleColumns.filter((t) => t?.toLowerCase().includes('date'));
    const otherColumns = visibleColumns.filter((t) => t && !dateColumns.includes(t));

    dateColumns.forEach((t) => dxDataGrid.instance.columnOption(t, 'selectedFilterOperation', 'between'));
    otherColumns.forEach((t) => dxDataGrid.instance.columnOption(t, 'selectedFilterOperation', 'contains'));
  }

  setTriggerDate(e, fieldName, observer) {
    if (e.editorName === 'dxDateBox' && e.dataField === fieldName) {
      const editorElList: HTMLElement[] = [...e.element.querySelectorAll('.dx-filter-range-content')];
      editorElList.forEach((t) => {
        observer.observe(t, { childList: true });
      });
    }
  }

  setDisplayDateFormat(e, fieldName, dateFormatFilterRow){
    if (e.parentType === 'filterRow' && e.dataField === fieldName) {
      e.editorOptions.displayFormat = dateFormatFilterRow
    }
  }

  hideColumns(dxDataGrid: DxDataGridComponent, columnsList: Array<string>) {
    const datagrid = dxDataGrid.instance;
    if (columnsList.length > 0) {
      for (let i = 0; i < datagrid.columnCount(); i++) {
        const col = datagrid.columnOption(i).dataField || datagrid.columnOption(i).caption;
        if (EXCEPT_COLUMNS.includes(col)) continue;
        datagrid.columnOption(i, 'visible', columnsList.includes(col));
      }
    } else {
      datagrid.getVisibleColumns().forEach((t, idx) => datagrid.columnOption(idx, 'visible', true));
    }
  }

  changeOrderColumns(dxDataGrid: DxDataGridComponent, columnsList: Array<string>) {
    const datagrid = dxDataGrid.instance;
    if (columnsList.length > 0) {
      let cloneArr = datagrid.getVisibleColumns().map((t) => t.dataField);
      cloneArr.sort((a, b) => {
        if (EXCEPT_COLUMNS.includes(a) || EXCEPT_COLUMNS.includes(b)) return 0;
        return columnsList.indexOf(a) - columnsList.indexOf(b);
      });
      for (let i = 0; i < datagrid.columnCount(); i++) {
        const col = datagrid.columnOption(i).dataField || datagrid.columnOption(i).caption;
        datagrid.columnOption(i, 'visibleIndex', cloneArr.indexOf(col));
      }
    }
  }

  pad2(n: string | number) {
    return n < 10 ? '0' + n : n;
  }

  handleDownloadingResponse(res: HttpResponse<Blob>, fileName: string = null): HttpResponse<Blob> {
    const blob = new Blob([res.body], { type: 'application/x-xls' });
    const date = new Date();
    const fileDate =
      date.getFullYear().toString() + this.pad2(date.getMonth() + 1) + this.pad2(date.getDate()) + this.pad2(date.getHours()) + this.pad2(date.getMinutes());
    const link = document.createElement('a');
    link.id = 'tempId';
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName ? `${fileName}_${fileDate}.xlsx` : `it-rack_${fileDate}.xlsx`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return res;
  }

  convertSaveDataManageView(conditionsArray: Array<any> = []) {
    return conditionsArray.map((t) => {
      if (Array.isArray(t) && ['milestones', 'supplierName', 'transportType', 'operatorCode'].includes(t[0])) {
        const clonedEl = [...t];
        return [clonedEl[0], clonedEl[1], (clonedEl[2] = clonedEl[2].join('+'))];
      }
      return t;
    });
  }

  revertSaveDataManageView(filterInfo: FilterInfo[] = []) {
    let result = this.genFilterConditions(filterInfo);
    const rs = result.map((t) => {
      if (Array.isArray(t) && ['milestones', 'supplierName', 'transportType', 'operatorCode'].includes(t[0])) {
        return [t[0], t[1], t[2].split('+')];
      }
      return t;
    });
    return rs
  }

  calculateFilterExpression(filterValues, selectedFilterOperation) {
    const field = this as any;
    let filterExpression: Array<any> = [];
    for (let i = 0; i < filterValues.length; i++) {
      let filterExpr = [field.dataField, selectedFilterOperation || '=', filterValues[i]];
      if (i > 0) {
        filterExpression.push('or');
      }
      filterExpression.push(filterExpr);
    }
    return filterExpression;
  }
}
