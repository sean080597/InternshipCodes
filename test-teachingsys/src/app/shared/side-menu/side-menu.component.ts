import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FIXED_MENU_CONFIG } from 'src/app/@core/constants';
import { filter } from 'rxjs';
import { AuthService } from '@app/@core/services/auth.service';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  currentRoute: any = null;
  menuConfig = FIXED_MENU_CONFIG;
  isWorkpageOpen = true;
  isSubmissionOpen = true;
  isManagementOpen = true;
  isAdmin: boolean
  isTeacher: boolean
  isStudent: boolean
  constructor(
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    this.isAdmin = this.authService.isAdmin()
    this.isTeacher = this.authService.isTeacher()
    this.isStudent = this.authService.isStudent()
    this.currentRoute = router.url;
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((url:any) => this.currentRoute = url.url);
  }
  ngOnInit(): void {
    $('#sidebarCollapse').on('click', function () {
      $('#tms-sidebar').toggleClass('active');
    });
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
