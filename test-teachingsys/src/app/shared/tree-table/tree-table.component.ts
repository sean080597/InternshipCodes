import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DATATABLE_ACTIONS } from '@app/@core/constants';
import { Group } from '@app/pages/class/model/group.model';
import { TableActionButton } from 'src/app/@core/interfaces';
import { TableField, TreeTableInterface } from './tree-table.interface';
import * as _ from 'lodash';
interface DataItem {
    name: string;
    age: number;
    address: string;
}
@Component({
    selector: 'app-tree-table',
    templateUrl: './tree-table.component.html',
    styleUrls: ['./tree-table.component.scss'],
})
export class TreeTableComponent implements OnInit {
    @Input() tableFields: TableField[] = [];
    @Input() listOfMapData: TreeTableInterface[] = [];
    @Input() actionButtons: TableActionButton[] = [];
    @Input() isParentFullDetail: boolean = false;
    @Input() isLearningActivity: boolean = false;
    @Output() triggerActionButton: EventEmitter<{ action: DATATABLE_ACTIONS, item: Group }> = new EventEmitter();
    @Output() onChosenActivity: EventEmitter<any> = new EventEmitter();
    @Output() onPageIndexChange: EventEmitter<number> = new EventEmitter();
    @Output() onPageSizeChange: EventEmitter<number> = new EventEmitter();
    configWidthCols: string[] = [];
    listOfCurrentPageData: readonly [] = [];
    mapOfExpandedData: { [key: string]: any } = {};
    currentRoute = '';
    isVisible = false;
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    modal = {
        title: '',
        content: ''
    }
    searchTitleValue = '';
    titleFilterVisible = false;
    visible = false;
    listOfDisplayData: TreeTableInterface[] = [];
    constructor(private router: Router
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['listOfMapData'].currentValue) {
            this.listOfMapData = changes['listOfMapData'].currentValue;
            this.convertToDataTreeTable();
            this.resetTitleSearch();
        }
    }

    ngOnInit(): void {
        this.listOfDisplayData = this.listOfMapData;
        for (let i = 0; i < this.tableFields.length; i++) {
            this.configWidthCols[i] = this.tableFields[i].header === 'status' ? '200px' : 'auto';
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

    onPageIndexChangeEvent(index: number): void {
        this.onPageIndexChange.next(index);
    }

    onPageSizeChangeEvent(size: number): void {
        this.onPageSizeChange.next(size);
    }

    convertToDataTreeTable() {
        this.listOfMapData.forEach((item: any) => {
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
    }

    tableActionOnClick(action: number, item: any) {
        this.triggerActionButton.emit({ action: action, item: item });
    }

    getTaskDetails(id: number) {
        this.currentRoute = this.router.url;
        if (this.currentRoute === '/question-bank') {
            this.router.navigate(
                ['../question-bank/task-details', id],
                { skipLocationChange: true }
            );
        } else if (this.currentRoute === '/learning-activity') {
            this.router.navigate(
                ['../learning-activity/view-details', id],
                { skipLocationChange: true }
            );
        }
    }
    getLearningDetails(id: string) {
        this.currentRoute = this.router.url;
        if (this.currentRoute === '/learning-activity') {
            this.router.navigate(
                ['../learning-activity/view-details', id],
                { skipLocationChange: true }
            );
        }
    }


    resetTitleSearch(): void {
        this.searchTitleValue = '';
        this.searchTitle();
    }

    searchTitle(): void {
        this.titleFilterVisible = false;
        const parentSearch = this.listOfMapData.filter((item) => {
            return item.title?.indexOf(this.searchTitleValue) !== -1;
        });
        const childrenSearch = [];
        this.listOfMapData.forEach((item) => {
            const temp = item.children?.filter(i => i.title.indexOf(this.searchTitleValue) !== -1);
            if (temp.length > 0) {
                childrenSearch.push(item);
            }
        });
        this.listOfDisplayData = _.union(parentSearch, childrenSearch);
    }
}
