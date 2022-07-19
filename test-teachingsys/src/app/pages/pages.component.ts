import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FIXED_MENU_CONFIG } from '../@core/constants';
import { CommonService } from '../@core/services/common.service';
import { SideMenuComponent } from '../shared/side-menu/side-menu.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  @ViewChild(SideMenuComponent) sideBar!: SideMenuComponent;
  private unsubscribe = new Subject<void>();
  public isLoading = false;
  isCollapsed = false;
  currentRoute = '';
  menuConfig = FIXED_MENU_CONFIG;
  constructor(
    private router: Router,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
  ) {
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = this.router.url
        }
      }
    );
  }
  ngOnInit(): void {

  }
  trigger(e: any) {
    this.isCollapsed = e;
  }
  ngAfterViewInit(): void {
    this.commonService.spinerLoading.pipe(takeUntil(this.unsubscribe)).subscribe((res: any) => {
      this.isLoading = res;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
