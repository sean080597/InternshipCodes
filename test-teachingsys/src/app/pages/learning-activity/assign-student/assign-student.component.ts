import { Component, Input, OnInit } from '@angular/core';
import { LearningActivityService } from '@app/@core/services/learning-activity.service';
import { Student } from '@app/pages/class/model/student.model';
import { ClassManagementService } from '@app/pages/class/service/class-management.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import * as _ from 'lodash';

@Component({
  selector: 'app-assign-student',
  templateUrl: './assign-student.component.html',
  styleUrls: ['./assign-student.component.scss']
})
export class AssignStudentComponent implements OnInit {
  @Input() activityID: string;
  activityData: any = {};
  selectedClass = '';
  classList: any = [];
  searchValue = '';
  currentLang = localStorage.getItem('language');
  isShowPreview = false;
  nodes: any = [];
  selectedStudent = [];
  selectedClassId = '';
  groupStudent: any;
  constructor(
    private learningActivityService: LearningActivityService,
    private classManagementService: ClassManagementService,
    private modal: NzModalRef,
  ) { }

  ngOnInit(): void {
    this.getActivityDetail();
    this.getClassList();
  }

  getActivityDetail() {
    this.learningActivityService.getLearningActivityByID(this.activityID).subscribe(res => {
      this.activityData = res.data;
    });
  }
  getClassList () {
    this.classManagementService.getClassAdminList().subscribe(res => {
      this.classList = res.data.map((c) => {
        return {value: c.uniqId, label: c.title}
      })
    });
  }

  async getGroupStudentByClassId(data) {
    this.nodes = await this.convertToTreeList(data); 
  }
  onSelected (e) {
    this.selectedClassId = e;
    this.classManagementService.getGroupByClassId(e).subscribe(res => {
      this.groupStudent = res;
    }).add(() => {
      this.getGroupStudentByClassId(this.groupStudent);
    });
    
  }
  nzEvent(event: NzFormatEmitEvent): void {
      if (event.node?.level != 0) {
        if (event.node?.isChecked) {
          this.selectedStudent.push(event.node?.origin);
        }
        if (!event.node?.isChecked) {
          this.selectedStudent = this.selectedStudent.filter(s => s.key !== event.node?.origin.key);
        }
      } else {
        event.node?.children.forEach((e) => {
          if (e.isChecked) {
            this.selectedStudent.push(e.origin);
          }
          if (!event.node?.isChecked) {
            this.selectedStudent = this.selectedStudent.filter(s => s.key !== e.origin.key);
          }
        })

      }
  }
  onClose(key): void {
    console.log(key);
  }
  convertToTreeList(data): Promise<any[]>  {
    return new Promise(resolve => {
      const res = [];
      data.forEach((group, index) => {
        const groupConverted = {
          title: group.title,
          key: index,
          expanded: true,
          selectable: false,
          children: group.students.map(stu => {
            return {
              title: this.currentLang === 'zh' ? stu.fullNameChi : stu.fullNameEng,
              key: stu.userId,
              isLeaf: true,
              selectable: false,
            }
          })
        }
        res.push(groupConverted);
      })
      resolve(res)
    })
  }

  destroyModal(isOk) {
    const submitData = {
      isSubmit: isOk,
      classId: this.selectedClassId,
      learningActivityId: this.activityID,
      students: isOk ? this.selectedStudent : []
    };
    this.modal.destroy(submitData);
  }
}
