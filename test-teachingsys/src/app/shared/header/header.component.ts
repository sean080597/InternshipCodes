import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/@core/services/common.service';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import { AuthService } from '@app/@core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  @Output() collapseTrigger: EventEmitter<any> = new EventEmitter();
  selectedLang: string | null = 'zh';
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
    private i18n: NzI18nService,
    private authService: AuthService
  ) {
    this.selectedLang = this.translate.currentLang
  }

  ngOnInit(): void { }

  trigger() {
    this.isCollapsed = !this.isCollapsed;
    this.collapseTrigger.emit(this.isCollapsed);
  }
  triggerLanguage() {
    if (this.selectedLang === 'en') {
      this.chineseClick();
    } else {
      this.englishClick();
    }
  }
  englishClick() {
    window.location.reload();
    this.translate.use("en");
    this.commonService.emit("en");
    this.i18n.setLocale(en_US);
    localStorage.setItem('language', 'en');
    this.selectedLang = localStorage.getItem('language');
    console.log("translate", this.translate.currentLang);
  }
  chineseClick() {
    window.location.reload();
    this.translate.use("zh");
    this.commonService.emit("zh");
    this.i18n.setLocale(zh_CN);
    localStorage.setItem('language', 'zh');
    this.selectedLang = localStorage.getItem('language');
    console.log("translate", this.translate.currentLang);
  }
  logout() {
    this.authService.logout()
  }
}
