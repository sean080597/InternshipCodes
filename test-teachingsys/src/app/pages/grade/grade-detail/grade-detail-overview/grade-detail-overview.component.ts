import { GradeOverview } from './../../model/grade-details';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grade-detail-overview',
  templateUrl: './grade-detail-overview.component.html',
  styleUrls: ['./grade-detail-overview.component.scss']
})
export class GradeDetailOverviewComponent implements OnInit {
  @Input() gradeOverview: GradeOverview;

  constructor() { }

  ngOnInit(): void {
  }

}
