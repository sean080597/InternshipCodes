import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from '@app/@core/services/feedback.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  total = 1;
  searchTaskValue = '';
  searchActValue = '';
  searchEngNameValue = '';
  visibleTask = false;
  visibleAct = false;
  visibleEngName = false;
  submitDate = {
    compare: (a, b) => a.submittedDate - b.submittedDate
  }
  class = {
    listOfFilter: [
      {text: 'ME2151', value: 'ME2151'},
      {text: 'ME2152', value: 'ME2152'},
    ],
    filterFn: (list: string[], item) => list.some(className => item.class.indexOf(className) !== -1)
  }
  group = {
    listOfFilter: [
      {text: 'Group 1', value: 'Group 1'},
      {text: 'Group 2', value: 'Group 2'},
    ],
    filterFn: (list: string[], item) => list.some(groupName => item.group.indexOf(groupName) !== -1)
  }
  listOfAssignment = [];
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  listOfDisplayData: any[];

  reset(field: string): void {
    switch (field) {
      case 'task' : {
        this.searchTaskValue = '';
        this.search(field);
        break
      }
      case 'act' : {
        this.searchActValue = '';
        this.search(field);
        break
      }
      case 'eng-name' : {
        this.searchEngNameValue = '';
        this.search(field);
        break
      }
    }
  }

  search(field: string): void {
    switch (field) {
      case 'task' : {
        this.visibleTask = false;
        this.listOfDisplayData = this.listOfAssignment.filter((item) => item.task.indexOf(this.searchTaskValue) !== -1);
        console.log(this.searchTaskValue, this.listOfAssignment.filter((item) => item.task.indexOf(this.searchTaskValue) !== -1))
        break
      }
      case 'act' : {
        this.visibleAct = false;
        this.listOfDisplayData = this.listOfAssignment.filter((item) => item.learningActivity.indexOf(this.searchActValue) !== -1);
        break
      }
      case 'eng-name' : {
        this.visibleEngName = false;
        this.listOfDisplayData = this.listOfAssignment.filter((item) => item.studentEng.indexOf(this.searchEngNameValue) !== -1);
        break
      }
    }
  }

  reviewPage (assignmentId) {
    this.router.navigate(['submission/feedback/', assignmentId])
  }
  
  constructor( private router: Router,
    private translate: TranslateService,
    private feedbackService: FeedbackService
    ) { }

  ngOnInit(): void {
    this.feedbackService.getAllAssignment({status: 'Activity Feedback'}).subscribe(res => {
      res.data = res.data.map( assignment => ({...assignment, submittedDate: new Date(assignment.submittedDate)}))
      this.listOfAssignment = res.data;
      let listOfClass = [];
      let listOfGroup = [];
      for (let a in this.listOfAssignment) {
        this.listOfAssignment[a].submittedDate = new Date (this.listOfAssignment[a].submittedDate);
        if( listOfClass.indexOf(this.listOfAssignment[a].class) === -1 ) {
          listOfClass.push(this.listOfAssignment[a].class)           // get list of class
        }
        if( listOfGroup.indexOf(this.listOfAssignment[a].group) === -1 ) {
          listOfGroup.push(this.listOfAssignment[a].group)           // get list of group
        }
      }
      this.listOfDisplayData = [...this.listOfAssignment];
      this.class.listOfFilter = listOfClass.map(c => ({text: c, value: c})) // convert to listOfFilter class array
      this.group.listOfFilter = listOfGroup.map(g => ({text: g, value: g})) // convert to listOfFilter class array
    })
  }

}
