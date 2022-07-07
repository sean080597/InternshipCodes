import { Component, Input } from '@angular/core';
import { NzProgressStatusType, NzProgressTypeType } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent {
  @Input() isProgressing: boolean;
  @Input() proCount: number = 50;
  @Input() proType: NzProgressTypeType = 'circle';
  @Input() proStatus: NzProgressStatusType = 'active';

  constructor() { }
}
