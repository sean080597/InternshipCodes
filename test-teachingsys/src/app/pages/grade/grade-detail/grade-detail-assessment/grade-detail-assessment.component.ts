import { Grade } from './../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';
import { Evaluation } from '../../model/grade-details';

@Component({
  selector: 'app-grade-detail-assessment',
  templateUrl: './grade-detail-assessment.component.html',
  styleUrls: ['./grade-detail-assessment.component.scss']
})
export class GradeDetailAssessmentComponent implements OnInit {
  @Input() gradeVisualInspection: Evaluation[] = [];
  @Input() gradeFunctionalChecks: Evaluation[] = [];
  @Input() grade!: Grade;

  constructor() { }

  ngOnInit(): void {
  }

}
