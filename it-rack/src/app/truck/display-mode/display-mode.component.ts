import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SUMMARY_WIDGETS } from '@app/shared/constants';
import { DevExtremeService } from '@app/shared/dev-extreme.service';
import { SummaryWidgetData, TruckTrackingMilestones, TruckTrackingRequestBody, TruckTrackingResponseBody, TruckViewSource } from '@app/truck/truck.model';
import { TruckService } from '@app/truck/truck.service';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { LoadOptions } from 'devextreme/data/load_options';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-display-mode',
  templateUrl: './display-mode.component.html',
  styleUrls: ['./display-mode.component.scss'],
})
export class DisplayModeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
  @ViewChild('SummaryWidgets')
  summaryWidgetsRef: ElementRef;
  @Input() isFullscreen: boolean = false;
  @Input() isShowSummaryWidgets: boolean = true;
  @Input() viewSourceFilter: TruckViewSource;

  isProgressVisible = false;

  userId: number = 0;
  truckTrackingDataSource: DataSource;
  dateFormat = 'yyyy/MM/dd HH:mm';
  summaryWidgetsTitle: string[] = SUMMARY_WIDGETS;
  summaryWidgets: Array<SummaryWidgetData> = [];
  subscription: Subscription[] = [];
  intervalAutoScroll;
  handlingScrollSubject = new Subject<number>();

  constructor(private truckService: TruckService, private dxService: DevExtremeService) {}

  ngOnInit(): void {
    if (screenfull.isEnabled) {
      screenfull.onchange(() => {
        this.isFullscreen = (screenfull as screenfull.Screenfull).isFullscreen;
      });
    }
    this.userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    this.truckService.getSummaryWidgets(this.userId).subscribe((res: Array<SummaryWidgetData>) => (this.summaryWidgets = res));
    this.subscription.push(
      this.handlingScrollSubject.pipe(distinctUntilChanged()).subscribe((val) => {
        if (val === 1) {
          this.dxDataGrid.instance.state({});
          setTimeout(() => {
            this.handlingScrollSubject.next(0);
          }, 100);
        }
      })
    );
    this.autoScroll();
  }

  ngAfterViewInit(): void {
    this.sortFilterColumns(this.viewSourceFilter);
    this.initDataSource();
  }

  ngOnDestroy(): void {
    if (this.intervalAutoScroll) {
      clearInterval(this.intervalAutoScroll);
    }
    this.subscription.forEach((t) => t.unsubscribe());
  }

  onContentReady() {
    this.dxDataGrid?.instance.getScrollable().on('scroll', (e) => {
      if (e.scrollOffset.top + e.element.offsetHeight >= e.component.scrollHeight()) {
        this.handlingScrollSubject.next(1);
      }
    });
  }

  autoScroll() {
    this.intervalAutoScroll = setInterval(() => {
      let tblEl = document.querySelector('#display-mode-data-grid .dx-scrollable-container');
      if (tblEl) {
        tblEl.scrollTop += 4;
      }
    }, 500);
  }

  toggleFullscreen() {
    const el = document.querySelector('#display-page');
    if (el && screenfull.isEnabled) {
      screenfull.toggle(el);
    }
  }

  calculateGridHeight() {
    let summaryWidgetsHeight = 0;
    if (this.summaryWidgetsRef?.nativeElement?.offsetHeight > 0) {
      summaryWidgetsHeight = this.summaryWidgetsRef?.nativeElement?.offsetHeight;
    }
    // !isFullScreen => 140 = toggle fullscreen(20) + header(60) + home icon(~30) + datatable header(~30)
    // isFullScreen => 110 = toggle fullscreen(20) + datatable header(~30) + padding top & bottom page(60)
    const tblHeight = window.innerHeight - summaryWidgetsHeight - (this.isFullscreen ? 110 : 140);
    return tblHeight;
  }

  private initDataSource(): void {
    this.truckTrackingDataSource = new DataSource({
      key: 'id',
      load: (loadOptions: LoadOptions) => {
        this.isProgressVisible = false;
        const requestBody = this.viewSourceFilter.filter as TruckTrackingRequestBody;
        return this.truckService
          .getTruckTrackingSummary(requestBody)
          .pipe(
            map((response: TruckTrackingResponseBody) => {
              return {
                data: response.data.content,
                totalCount: response.data.totalElements,
                groupCount: response.data.totalPages,
              };
            })
          )
          .toPromise()
          .finally(() => {
            setTimeout(() => {
              const dataItem = this.truckTrackingDataSource.items();
              dataItem.forEach((data) => {
                if (data.milestones === 'In Main Carriage') {
                  this.isProgressVisible = true;
                  return;
                }
              });
            }, 100);
          });
      },
    });
  }

  genThemeClass() {
    if (this.dxDataGrid) {
      this.dxDataGrid.elementAttr = { class: this.isFullscreen ? 'dark' : 'light' };
    }
    return this.isFullscreen ? 'dark' : 'light';
  }

  isShowGPSicon(rowData) {
    return rowData.currentCity && rowData.milestones === TruckTrackingMilestones.inMainCarriage && !rowData.manualLocation;
  }

  sortFilterColumns(viewSource) {
    this.dxService.changeOrderColumns(this.dxDataGrid, viewSource?.columns);
    this.dxService.hideColumns(this.dxDataGrid, viewSource?.columns);
    viewSource.sort?.forEach((t) => this.dxDataGrid.instance.columnOption(t.selector, 'sortOrder', t.desc ? 'desc' : 'asc'));
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Space') {
      if (this.intervalAutoScroll) {
        clearInterval(this.intervalAutoScroll);
        this.intervalAutoScroll = false;
      } else {
        this.autoScroll();
      }
    }
  }
}
