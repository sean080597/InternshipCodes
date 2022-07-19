import { CommonService } from './../../../@core/services/common.service';
import { GradeDetail, GradeOverview, Evaluation, Grade } from './../model/grade-details';
import { GradeService } from './../service/grade.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeListItem } from '../model/grade-list';

@Component({
  selector: 'app-grade-detail',
  templateUrl: './grade-detail.component.html',
  styleUrls: ['./grade-detail.component.scss']
})
export class GradeDetailComponent implements OnInit {
  private _grade: GradeListItem;
  private _gradeDetail: GradeDetail;
  private _gradeOverview: GradeOverview;
  private _gradeVisualInspection: Evaluation[] = [];
  private _gradeFunctionalChecks: Evaluation[] = [];
  private _gradeField: Grade;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _gradeService: GradeService,
    private _commonService: CommonService
  ) { }

  public get grade(): GradeListItem {
    return this._grade;
  }

  public get gradeDetail(): GradeDetail {
    return this._gradeDetail;
  }

  public get gradeOverview(): GradeOverview {
    return this._gradeOverview;
  }

  public get gradeVisualInspection(): Evaluation[] {
    return this._gradeVisualInspection;
  }

  public get gradeFunctionalChecks(): Evaluation[] {
    return this._gradeFunctionalChecks;
  }

  public get gradeField(): Grade {
    return this._gradeField;
  }

  ngOnInit(): void {
    const grade = JSON.parse(this._activatedRoute.snapshot.paramMap.get('grade')) as GradeListItem;
    if (grade) {
      this._grade = grade;
      this._commonService.showLoading();
      this._gradeService.getGradeDetail(this._grade.id).subscribe(
        data => {
          this._gradeDetail = data;
          this._gradeOverview = {
            studentName: this._gradeDetail.studentName,
            task: this._gradeDetail.task,
            learningActivity: this._gradeDetail.learningActivity,
            class: this._gradeDetail.class,
            group: this._gradeDetail.group,
            studentScore: this._gradeDetail.studentScore,
            assignmentScore: this._gradeDetail.assignmentScore,
            isPassed: this._gradeDetail.isPassed
          };
          this._gradeDetail.assessment.evaluations.forEach(
            (evaluation) => {
              if (evaluation.type === 'Visual Inspection') {
                this._gradeVisualInspection.push(evaluation);
              }
              else {
                this._gradeFunctionalChecks.push(evaluation);
              }
            }
          );
          this._gradeField = this._gradeDetail.assessment.grade;
          this._commonService.hideLoading();
        },
        () => {
          this._commonService.hideLoading();
          this._router.navigate(['/grade']);
        }
      );
    } else {
      this._router.navigate(['/grade']);
    }
  }

}
