import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '@app/_services/common.service';

@Component({
  selector: 'app-actions-bar',
  templateUrl: './actions-bar.component.html',
  styleUrls: ['./actions-bar.component.scss']
})
export class ActionsBarComponent implements OnInit, AfterViewInit {
  templateVariable = this.commonService.actionsBarTemplate$
  isOnTop = this.commonService.isActionsBarOnTop$

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }
}
