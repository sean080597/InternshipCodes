import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestReportService } from '@app/@core/services/test-report.service';
import { TableField } from '@app/shared/tree-table/tree-table.interface';
import { TranslateService } from '@ngx-translate/core';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.scss']
})
export class TestReportComponent implements OnInit {
  loading = false
  dataSet: any = []
  tableFields: TableField[] = [
    {
      header: this.translate.instant('task_learning_activity'),
      fieldName: 'title',
    },
    {
      header: this.translate.instant('description'),
      fieldName: 'description',
    },
    {
      header: this.translate.instant('tbl.due_date'),
      fieldName: 'dueDate',
    },
    {
      header: this.translate.instant('tbl.number_submission'),
      fieldName: 'numberSubmission',
    },
  ];

  constructor(
    private router: Router,
    private testReportService: TestReportService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.searchData()
  }

  searchData() {
    this.loading = true
    this.testReportService.getAllTasks().pipe(first(), finalize(() => this.loading = false)).subscribe(res => this.dataSet = res)
  }

  gotoDetails(evt) {
    this.router.navigate(['/test-report/details', evt.id])
  }
}
