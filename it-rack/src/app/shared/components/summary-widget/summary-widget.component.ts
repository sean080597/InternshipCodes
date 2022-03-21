import { Component, Input } from '@angular/core';
import { SummaryWidgetData } from '@app/truck/truck.model';

@Component({
  selector: 'app-summary-widget',
  templateUrl: './summary-widget.component.html',
  styleUrls: ['./summary-widget.component.scss'],
})
export class SummaryWidgetComponent {
  @Input() title: string;
  @Input() data: SummaryWidgetData;
  @Input() theme: string = 'light';
}
