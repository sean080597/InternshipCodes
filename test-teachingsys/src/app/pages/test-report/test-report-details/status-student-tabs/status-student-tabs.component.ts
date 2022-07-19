import { Component, Input, OnInit } from '@angular/core';
import { STUDENT_STT } from '@app/@core/constants';
import { TestReportService } from '@app/@core/services/test-report.service';

@Component({
  selector: 'app-status-student-tabs',
  templateUrl: './status-student-tabs.component.html',
  styleUrls: ['./status-student-tabs.component.scss']
})
export class StatusStudentTabsComponent implements OnInit {
  classReportsDetailsList = this.testReportService.classReportsDetailsList$

  constructor(private testReportService: TestReportService) { }

  ngOnInit(): void { }

  genStatusColor(stt: STUDENT_STT) {
    return this.testReportService.genStatusColor(stt)
  }

  onChangeSelectedTabIdx(idx: number) {
    this.testReportService.setSelectedClassIdx(idx)
  }
}
