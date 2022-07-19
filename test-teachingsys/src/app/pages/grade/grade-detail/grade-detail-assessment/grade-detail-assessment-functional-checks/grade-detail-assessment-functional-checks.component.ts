import { Evaluation } from './../../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grade-detail-assessment-functional-checks',
  templateUrl: './grade-detail-assessment-functional-checks.component.html',
  styleUrls: ['./grade-detail-assessment-functional-checks.component.scss']
})
export class GradeDetailAssessmentFunctionalChecksComponent implements OnInit {
  @Input() gradeFunctionalChecks: Evaluation[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public get studentSum(): number {
    let sum = 0;
    this.gradeFunctionalChecks.forEach(
      evaluation => {
        sum += evaluation.studentScore;
      }
    );
    return sum;
  }

  public get teacherSum(): number {
    let sum = 0;
    this.gradeFunctionalChecks.forEach(
      evaluation => {
        sum += evaluation.teacherScore;
      }
    );
    return sum;
  }

  public get fractionSum(): number {
    let sum = 0;
    this.gradeFunctionalChecks.forEach(
      evaluation => {
        sum += evaluation.fraction;
      }
    );
    return sum;
  }
}
