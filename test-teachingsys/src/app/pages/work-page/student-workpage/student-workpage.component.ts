import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentWorkpageService } from '@app/@core/services/student-workpage.service';
import { DATETIME_FORMATS, WORKPAGE_ACTION_BTNS } from '@app/@core/constants';
import { Filter } from '@app/@core/interfaces';
import { StudentWorkpage } from '@app/@core/models/student-workpage';
import { TranslateService } from '@ngx-translate/core';
import { first, finalize } from 'rxjs';

@Component({
  selector: 'app-student-workpage',
  templateUrl: './student-workpage.component.html',
  styleUrls: ['./student-workpage.component.scss']
})
export class StudentWorkpageComponent implements OnInit, AfterViewInit {
  public tableHeight!: number;
  @ViewChild('tableContainer') _tableContainer!: ElementRef;
  datetimeFormats = DATETIME_FORMATS

  loading = false;
  filterStudent: Filter;
  dataSet = [];

  constructor(
    private router: Router,
    private studentWorkpageService: StudentWorkpageService,
    private translateService: TranslateService
  ) {
    this.filterStudent = this.studentWorkpageService.filterStudent
  }

  ngOnInit(): void {
    this.searchData()
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.tableHeight = this._tableContainer.nativeElement.clientHeight - 140, 100)
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.filterStudent.pageIndex = 1
    }
    this.loading = true
    const filter = this.studentWorkpageService.buildFilter(this.filterStudent)
    this.studentWorkpageService.getAllWorkpage(filter)
      .pipe(first(), finalize(() => this.loading = false))
      .subscribe(res => {
        this.filterStudent.totalCount = res.totalCount
        this.dataSet = this.mapResData(res.data)
      });
  }

  mapResData(data: StudentWorkpage[]) {
    return data.map(t => {
      const showBtn = this.studentWorkpageService.genNextAction(t.status, t.internalStatus, t.isPassed)
      return { ...t, ...showBtn }
    })
  }

  onAction(data) {
    if (data.disabled) return
    switch (data.btnText) {
      case 'start':
        this.router.navigate(['/work-page/questions', data.assignmentId])
        break;
      case 'self_evaluation':
        this.router.navigate(['/work-page/self-evaluation', data.assignmentId])
        break;
      case 'view_feedback':
        this.router.navigate(['/work-page/view-feedback', data.assignmentId])
        break;
      case 'give_feedback':
        this.router.navigate(['/work-page/give-feedback', data.assignmentId])
        break;
      default:
        break;
    }
  }
}
