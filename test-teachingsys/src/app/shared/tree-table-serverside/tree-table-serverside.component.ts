import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from './../common.constant';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DATATABLE_ACTIONS } from '@app/@core/constants';
import { TableActionButton } from '@app/@core/interfaces';
import { Group } from '@app/pages/class/model/group.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TableField, TreeTableInterface } from '../tree-table/tree-table.interface';
import * as _ from 'lodash';

@Component({
    selector: 'app-tree-table-serverside',
    templateUrl: './tree-table-serverside.component.html',
    styleUrls: ['./tree-table-serverside.component.scss']
})
export class TreeTableServersideComponent implements OnInit {
    @Input() tableFields: TableField[] = [];
    @Input() listOfMapData: TreeTableInterface[] = [];
    @Input() actionButtons: TableActionButton[] = [];
    @Input() isParentFullDetail: boolean = false;
    @Input() loading: boolean = false;
    @Input() total: number = 0;
    @Input() pageSize: number = DEFAULT_PAGE_SIZE;
    @Input() pageIndex: number = DEFAULT_PAGE_INDEX;
    @Output() triggerActionButton: EventEmitter<{ action: DATATABLE_ACTIONS, item: Group }> = new EventEmitter();
    @Output() onChosenActivity: EventEmitter<any> = new EventEmitter();
    @Output() onQueryParams: EventEmitter<NzTableQueryParams> = new EventEmitter;
    configWidthCols: string[] = [];
    configSearchCols: any = {};
    listOfCurrentPageData: readonly [] = [];
    mapOfExpandedData: { [key: string]: any } = {};
    currentRoute = '';
    isVisible = false;
    modal = {
        title: '',
        content: ''
    }
    searchTitleValue = '';
    titleFilterVisible = false;
    visible = false;
    listOfDisplayData: TreeTableInterface[] = [];
    constructor(private router: Router) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['listOfMapData']?.currentValue) {
            this.listOfMapData = changes['listOfMapData'].currentValue;
            this.convertToDataTreeTable();
            this.resetSearch(this.tableFields[0].fieldName);
        }
    }

    ngOnInit(): void {
        for (let i = 0; i < this.tableFields.length; i++) {
            this.configWidthCols[i] = this.tableFields[i].header === 'status' ? '200px' : 'auto';
            if (this.tableFields[i].isFilter) {
                this.configSearchCols[this.tableFields[i].fieldName] = {
                    searchVisible: false,
                    searchValue: ''
                }
            }
        }
        if (this.actionButtons.length > 0) {
            this.configWidthCols[this.tableFields.length] = '150px'
        }

    }

    collapse(
        array: TreeTableInterface[],
        data: TreeTableInterface,
        $event: boolean
    ): void {
        if (!$event) {
            if (data.children) {
                data.children.forEach((d) => {
                    const target = array.find((a) => a.key === d.key)!;
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    convertTreeToList(root: TreeTableInterface): TreeTableInterface[] {
        const stack: TreeTableInterface[] = [];
        const array: TreeTableInterface[] = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });
        while (stack.length !== 0) {
            const node = stack.pop()!;
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({
                        ...node.children[i],
                        level: node.level! + 1,
                        expand: false,
                        parent: node,
                    });
                }
            }
        }
        return array;
    }

    taskView(item: any) {
        if (item.id) {
            this.onChosenActivity.emit(item)
        }
    }

    visitNode(
        node: TreeTableInterface,
        hashMap: { [key: string]: boolean },
        array: TreeTableInterface[]
    ): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    onCurrentPageDataChange($event: any): void {
        this.listOfCurrentPageData = $event;
    }

    onQueryParamsChange(params: NzTableQueryParams) {
        this.onQueryParams.next(params);
    }

    convertToDataTreeTable() {
        this.listOfMapData.forEach((item: any) => {
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
    }

    tableActionOnClick(action: number, item: any) {
        this.triggerActionButton.emit({ action: action, item: item });
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
        if (fieldName === 'title') {
            console.log(fieldName)
            const parentSearch = this.listOfMapData.filter((item) => {
                return item.title?.indexOf(this.configSearchCols[fieldName].searchValue) !== -1;
            });
            const childrenSearch = [];
            this.listOfMapData.forEach((item) => {
                const temp = item.children?.filter(i => i.title.indexOf(this.configSearchCols[fieldName].searchValue) !== -1);
                if (temp.length > 0) {
                    childrenSearch.push(item);
                }
            });
            this.listOfDisplayData = _.union(parentSearch, childrenSearch);
        } else {
            this.listOfDisplayData = this.listOfMapData.filter((item) => {
                return item[fieldName]?.indexOf(this.configSearchCols[fieldName].searchValue) !== -1;
            });
        }
    }
}
