import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DATATABLE_ACTIONS } from 'src/app/@core/constants';
import { TableActionButton } from 'src/app/@core/interfaces';
import { LearningActivityService } from 'src/app/@core/services/learning-activity.service';
import { TableField } from 'src/app/shared/tree-table/tree-table.interface';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SelectTaskDialogComponent } from './learning-activity-form/select-task-dialog/select-task-dialog.component';
import { arraysEqual } from 'ng-zorro-antd/core/util';
import { AssignStudentComponent } from './assign-student/assign-student.component';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
    selector: 'app-learning-activity',
    templateUrl: './learning-activity.component.html',
    styleUrls: ['./learning-activity.component.scss']
})
export class LearningActivityComponent implements OnInit {
    listOfMapData: any;
    tableFields: TableField[] = [
        {
            header: this.translate.instant('task_learning_activity'),
            fieldName: 'title',
            isFilter: true
        },
        {
            header: this.translate.instant('description'),
            fieldName: 'description',
        },
        {
            header: this.translate.instant('last_updated_date'),
            fieldName: 'updated',
        },
        {
            header: this.translate.instant('status'),
            fieldName: 'status',
        },
    ];
    actionButtons: TableActionButton[] = [];
    modal = {
        title: '',
        content: ''
    }
    onChoosenLearningActivity: any;
    isVisible = false;
    constructor(
        private learningActivityService: LearningActivityService,
        private router: Router,
        private translate: TranslateService,
        private modalService: NzModalService,
        private msg: NzMessageService
    ) {
    }
    ngOnInit(): void {
        this.actionButtons = [
            {
                title: this.translate.instant('assign'),
                hasPermission: true,
                action: DATATABLE_ACTIONS.ASSIGN,
            },
            {
                title: this.translate.instant('edit'),
                hasPermission: true,
                action: DATATABLE_ACTIONS.EDIT,
            },
            {
                title: this.translate.instant('delete'),
                hasPermission: true,
                action: DATATABLE_ACTIONS.DELETE,
            },
            {
                title: this.translate.instant('add_to_question_bank'),
                hasPermission: true,
                action: DATATABLE_ACTIONS.ADD_TO_QUESTION_BANK,
            },
        ];
        this.getlistOfLearningActivity();
    }
    create() {
        this.router.navigate(['learning-activity/create']);
    }

    getlistOfLearningActivity() {
        this.learningActivityService.getLearningActivityList().subscribe(res => {
            if (res) {
                const converted: any = [];
                res.data.forEach((item: any, i: number) => {
                    const result: any = {
                        key: i + 1,
                        title: item.taskName,
                        children: []
                    }
                    if (item.learningActivities.length > 0) {
                        item.learningActivities.forEach((child: any, j: number) => {
                            child.key = result.key + '-' + (j + 1);
                            result.children.push({
                                key: child.key,
                                title: child.name,
                                id: child.learningActivityUniqId,
                                inQuestionBank: child.inQuestionBank,
                                description: child.description,
                                updated: child.modifiedDate,
                                status: child.status,
                            })
                        })
                    }
                    converted.push(result);
                })
                this.listOfMapData = converted;
            }
        });
    }
    viewDetail(e) {
        console.log(e)
        this.router.navigate(['learning-activity/edit', e.item.id], { queryParams: { type: 'LA' } });
    }

    action(e) {
        if (e.action === DATATABLE_ACTIONS.EDIT) {
            this.router.navigate(['learning-activity/edit', e.item.id], { queryParams: { type: 'LA' } });
        } else if (e.action === DATATABLE_ACTIONS.DELETE) {
            this.modal = {
                // Are you sure you want to delete? 
                title: this.translate.instant('delete_confirm_title'),
                // This action can not be revised!
                content: this.translate.instant('delete_confirm_content')
            }
            this.onChoosenLearningActivity = e.item.id
            this.showModal();
        } else if (e.action === DATATABLE_ACTIONS.ADD_TO_QUESTION_BANK) {
            this.addToQuestionBank()
        } else if (e.action === DATATABLE_ACTIONS.ASSIGN) {
            this.assignStudent(e.item.id);
        }
    }
    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
        this.learningActivityService
            .deleteLearningActivity(this.onChoosenLearningActivity)
            .subscribe({
                next: (v) => {
                    this.getlistOfLearningActivity();
                },
                error: (e) => {
                },
                complete: () => console.info('complete')
            });
        this.router.navigate(['learning-activity'])
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    addToQuestionBank() {
        const modal = this.modalService.create({
            nzTitle: this.translate.instant('select_task_to_save'),
            nzWidth: '1000px',
            nzContent: SelectTaskDialogComponent,
            nzComponentParams: {
                type: 'LAL'
            }
        });
        modal.afterClose.subscribe(result => {
            console.log(result)
        })
    }

    assignStudent(activityID) {
        const modal = this.modalService.create({
            nzTitle: this.translate.instant('assign_to_student'),
            nzWidth: '1800px',
            nzContent: AssignStudentComponent,
            nzComponentParams: {
                activityID: activityID
            }
        });
        modal.afterClose.subscribe(result => {
            if (result.isSubmit) {
                const studentIds = result.students.map(s => s.key);
                const submitData = {
                    learningActivityUniqueId: result.learningActivityId,
                    groups: [],
                    students: studentIds,
                    classId: result.classId
                }
                this.learningActivityService.assignStudentToLA(submitData).subscribe((res) => {
                    if (res) {
                        this.msg.success(this.translate.instant('assign_student_successful'));
                        this.getlistOfLearningActivity();
                    }
                });
            }
        })
    }
}
