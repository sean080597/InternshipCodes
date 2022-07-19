import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartConfiguration, ChartType, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { QuestionReport } from '@app/@core/models/test-report';
import { ANSWERS } from '@app/@core/constants';

@Component({
  selector: 'app-question-chart',
  templateUrl: './question-chart.component.html',
  styleUrls: ['./question-chart.component.scss']
})
export class QuestionChartComponent implements OnInit {
  @Input('noQuestion') noQuestion: number = 0
  @Input('questionReport') questionReport: QuestionReport
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  barChartType: ChartType = 'bar';
  barChartPlugins = [DataLabelsPlugin];

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: this.translateService.instant('barchart.option'), backgroundColor: [], maxBarThickness: 30 }
    ],
  };

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const labels = this.questionReport.questionAnswerReports.map(t => t.answer)
    const data = this.questionReport.questionAnswerReports.map(t => t.numberOfAnswer)
    this.barChartData.labels = labels
    this.barChartData.datasets[0].data = data
    this.barChartData.datasets[0].backgroundColor = labels.map(t => t === ANSWERS.NO_ANSWER_YET ? '#C7C9CD' : '#2F80ED')
    this.setConfigChart()
    this.chart?.update()
  }

  // config bar chart
  setConfigChart() {
    const allValues = this.barChartData.datasets.flatMap(ds => ds.data);
    const maxValue = Math.max(...allValues);
    this.barChartOptions.scales.y.max = Math.ceil(maxValue * 1.05)
  }

  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public hideLegend(index: number) {
    if (this.barChartData.datasets[index].hidden) {
      this.barChartData.datasets[index].hidden = false;
    } else {
      this.barChartData.datasets[index].hidden = true;
    }
    this.chart.update();
  }
}
