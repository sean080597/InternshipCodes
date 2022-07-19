import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityDetailsReport } from '@app/@core/models/test-report';
import { TestReportService } from '@app/@core/services/test-report.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test-report-details',
  templateUrl: './test-report-details.component.html',
  styleUrls: ['./test-report-details.component.scss']
})
export class TestReportDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  activityData: ActivityDetailsReport
  questionReports = this.testReportService.selectedQuestionReportList$

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private testReportService: TestReportService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      if (!params.get('id')) this.router.navigate(['/test-report'])
      this.prepareData(params.get('id'))
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  prepareData(learningActivityUniqId) {
    this.testReportService.getActivityDetails(learningActivityUniqId).subscribe(res => {
      this.activityData = res.data
      this.testReportService.getMultiClassReport(learningActivityUniqId, this.activityData.classReports).subscribe(res => {
        this.testReportService.setClassReportsDetailsList(res)
      })
    })
  }
}
