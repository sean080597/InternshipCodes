import { Grade } from './../../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grade-detail-assessment-grade',
  templateUrl: './grade-detail-assessment-grade.component.html',
  styleUrls: ['./grade-detail-assessment-grade.component.scss']
})
export class GradeDetailAssessmentGradeComponent implements OnInit {
  @Input() grade: Grade = new Grade();

  constructor() { }

  ngOnInit(): void {
  }

}
