import { Component, OnInit, ViewChild } from '@angular/core'
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import DataLabelsPlugin from 'chartjs-plugin-datalabels'
import { TranslateService } from '@ngx-translate/core'
import { TestReportService } from '@app/@core/services/test-report.service'
import { cloneDeep } from 'lodash'

@Component({
  selector: 'app-best-students-chart',
  templateUrl: './best-students-chart.component.html',
  styleUrls: ['./best-students-chart.component.scss'],
})
export class BestStudentsChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined
  selectedClassIdx = this.testReportService.selectedClassIdx$

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
      { data: [], label: this.translateService.instant('barchart.correct'), backgroundColor: '#27AE60', maxBarThickness: 30 },
      { data: [], label: this.translateService.instant('barchart.wrong'), backgroundColor: '#FF5252', maxBarThickness: 30 },
      { data: [], label: this.translateService.instant('barchart.noAnswerYet'), backgroundColor: '#C7C9CD', maxBarThickness: 30 }
    ],
  }

  constructor(
    private testReportService: TestReportService,
    private translateService: TranslateService
  ) {
    this.testReportService.selectedQuestionReportList$.subscribe(
      (questionReports) => {
        const labels = questionReports?.map((t, i) => 'Question ' + (i + 1)) || []
        const numberOfCorrect = questionReports?.map((t) => t.numberOfCorrect) || []
        const numberOfWrong = questionReports?.map((t) => t.numberOfWrong) || []
        const numberOfNoAnswerYet = questionReports?.map((t) => t.numberOfNoAnswerYet) || []
        const clonedChartData = cloneDeep(this.barChartData)
        clonedChartData.labels = labels
        clonedChartData.datasets[0].data = numberOfCorrect
        clonedChartData.datasets[1].data = numberOfWrong
        clonedChartData.datasets[2].data = numberOfNoAnswerYet
        this.barChartData = { ...clonedChartData }
        this.setConfigChart()
        this.chart?.update()
      }
    )
  }

  ngOnInit(): void { }

  // config bar chart
  setConfigChart() {
    const allValues = this.barChartData.datasets.flatMap((ds) => ds.data)
    const maxValue = Math.max(...allValues)
    this.barChartOptions.scales.y.max = Math.ceil(maxValue * 1.05)
  }

  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public hideLegend(index: number) {
    this.barChartData.datasets[index].hidden = !this.barChartData.datasets[index].hidden
    this.chart.update()
  }
}
