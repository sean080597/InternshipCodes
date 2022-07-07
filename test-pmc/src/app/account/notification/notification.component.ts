import {
  Component,
  ViewEncapsulation,
  ElementRef,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { ToastService } from '@app/shared/toast/toast.service';
import { COMMON_CONFIGS } from '@app/_constants';
import { Notify } from '@app/_models/account/notification.model';
import { AccountService } from '@app/_services';
import { TranslateService } from '@ngx-translate/core';
import { NotifyService } from './notification.service';

@Component({
  selector: 'notify',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotifyComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Output() bellsNumber: EventEmitter<number> = new EventEmitter();
  private element: HTMLElement;
  private isMode = true;
  public notifyList: Array<Notify>;
  private colorHighlight = '#DDDDDD';
  public commonConfigs = COMMON_CONFIGS;
  public countExpand = 0;
  public loading = false;
  public page = 1;
  public pageSize = 10;
  public availablePages: number; //

  constructor(
    private notifyService: NotifyService,
    private translateService: TranslateService,
    private accountService: AccountService,
    private toast: ToastService,
    private el: ElementRef
  ) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      console.error('notify must have an id');
      return;
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close notify on background click
    this.element.addEventListener('click', (el: MouseEvent) => {
      if ((el.target as HTMLElement).className === 'notify-background') {
        this.close();
      }
    });

    // add self (this notify instance) to the notify service so it's accessible from controllers
    this.notifyService.add(this);
  }

  stroke(): void {
    if (this.isMode) {
      return this.open();
    }
    return this.close();
  }
  // open notify
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('notify-open');
    this.isMode = !this.isMode;
    (
      document.getElementsByClassName('notify-body')[0] as HTMLElement
    ).style.animation = 'move-down 0.5s both';
  }

  // close notify
  close(): void {
    document.body.classList.remove('notify-open');
    this.isMode = !this.isMode;
    (
      document.getElementsByClassName('notify-body')[0] as HTMLElement
    ).style.animation = 'move-up 0.5s both';
    setTimeout(() => {
      this.element.style.display = 'none';
    }, 500); // 0.5s
  }
  collapse(index: number) {
    this.notifyList[index].isCollapse = !this.notifyList[index].isCollapse;
    if (this.notifyList[index].isCollapse) {
      this.countExpand ++;
    } else {
      this.countExpand --;
    }
    if(this.notifyList[index].newFlag) {
      this.accountService.updateBellsList(this.notifyList[index].id).subscribe({
       next: (resp) => {
        this.notifyList[index].newFlag = resp.newFlag;
         // update count bell number
         this.accountService.getBellsList().subscribe((respNewNumber) => {
           this.bellsNumber.emit(respNewNumber.newNumber);
         });
        }
      });
    }
  }
  highlighted(index: number) {
    const arrayElement = document.getElementsByClassName(`highlight`);
    Array.prototype.forEach.call(arrayElement, (element: any, indexTwo) => {
      if (index === indexTwo) {
        return (element.style.backgroundColor = this.colorHighlight);
      }
      return (element.style.backgroundColor = 'transparent');
    });
  }
  getCategory(category: string) {
    switch (category) {
      case 'MAINTENANCE': {
        return this.translateService.instant(
          'NOTICA_MANAGEMENT.DETAIL.CATEGORY_LIST.MAINTENANCE'
        );
      }
      case 'NOTICE': {
        return this.translateService.instant(
          'NOTICA_MANAGEMENT.DETAIL.CATEGORY_LIST.NOTICE'
        );
      }
      case 'FAILURE': {
        return this.translateService.instant(
          'NOTICA_MANAGEMENT.DETAIL.CATEGORY_LIST.FAILURE'
        );
      }
    }
  }
  onScroll() {
    if (this.page < this.availablePages) {
      this.loading = true;
      this.page =  this.page + 1;
      const params = { page: this.page, pageSize: this.pageSize }
      this.accountService.getBellsList(params).subscribe(resp => {
        this.availablePages = resp.availablePages;
        const notifyList = resp.items.map((item) => new Notify(item))
        this.notifyList.push(...notifyList);
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.toast.toastError(error?.message)
      });
    }
  }
  // remove self from notify service when component is destroyed
  ngOnDestroy(): void {
    this.notifyService.remove(this.id);
    this.element.remove();
  }

}
