import { Evaluation } from './../../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grade-detail-assessment-visual-inspection',
  templateUrl: './grade-detail-assessment-visual-inspection.component.html',
  styleUrls: ['./grade-detail-assessment-visual-inspection.component.scss']
})
export class GradeDetailAssessmentVisualInspectionComponent implements OnInit {
  @Input() gradeVisualInspection: Evaluation[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public get studentSum(): number {
    let sum = 0;
    this.gradeVisualInspection.forEach(
      evaluation => {
        sum += evaluation.studentScore;
      }
    );
    return sum;
  }

  public get teacherSum(): number {
    let sum = 0;
    this.gradeVisualInspection.forEach(
      evaluation => {
        sum += evaluation.teacherScore;
      }
    );
    return sum;
  }

  public get fractionSum(): number {
    let sum = 0;
    this.gradeVisualInspection.forEach(
      evaluation => {
        sum += evaluation.fraction;
      }
    );
    return sum;
  }
}
