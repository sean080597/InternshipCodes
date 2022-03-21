import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from './navigation/navigation.service';
import { SettingComponent } from './setting/setting.component';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ROUTES } from './navigation/navigation.component';
import { FormControl, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DynamicService } from './favorite/favorite.service';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelpService } from './help.service';
import { MenuComponent } from './menu/menu.component';
import { SNACKBAR_DURATION, UserRole } from '@shared/constants';
import { NavigationSeaItem } from './navigation/navigation.model';
import { NavigationTruckItem } from './navigation/navigation.model';
import { SharedService } from '@app/shared/shared.service';

export function pad2(n: string | number) {
  return n < 10 ? '0' + n : n;
}
@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss'],
})
export class FavouriteComponent implements OnInit, OnDestroy, AfterViewInit {
  userName = '';
  userRole = '';
  role = UserRole.empty;

  private listTitles: any[];
  location: Location;
  sea: NavigationSeaItem[];
  truck: NavigationTruckItem[];
  navigationModel = [];
  navigationModelChangeSubscription: Subscription;

  crumbsHTML: any[];
  validateForm: FormGroup;
  helpForm: FormGroup;
  notiForm: FormGroup;
  notiMaintain = false;
  formErrors = {
    configUrl: '',
    emailUrl: '',
  };
  configUrl = '';
  emailUrl = '';
  title = '';
  content = '';
  contact = '';
  showModel = false;
  showNoti = false;
  isLoading$ = this.sharedService.loading$
  paramObj = {};
  winWidth;
  @ViewChild('mainWrapper', { static: true }) mainWrapper: ElementRef;
  @ViewChild('userMenu', { static: true }) menu: MenuComponent;
  noticeActive = true;
  isMenuOpen = true;

  constructor(
    location: Location,
    private navigationService: NavigationService,
    private dynamicService: DynamicService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private helpService: HelpService,
    private sharedService: SharedService
  ) {
    this.location = location;
  }

  ngOnInit() {
    if (localStorage.getItem('login_module') === 'sea') {
      this.navigationModel = this.sea;
    } else if (localStorage.getItem('login_module') === 'truck') {
      this.navigationModel = this.truck;
    } else {
      this.navigationModel = this.sea;
    }
    this.winWidth = window.innerWidth;
    // console.log('this.winWidth',this.winWidth);
    if (parseInt(this.winWidth) > 1366) {
      this.isMenuOpen = true;
    }
    // this.helpService.getHelpURL().subscribe( result => {
    //   this.configUrl = result['data']['name'];
    // });
    if (!sessionStorage.getItem('helpUrl')) {
      this.helpService.getHelpURL().subscribe((result) => {
        const data = JSON.parse(result['data']['name']);
        this.configUrl = data['configUrl'];
        sessionStorage.setItem('helpUrl', this.configUrl);
        this.emailUrl = data['emailUrl'];
        sessionStorage.setItem('emailUrl', this.emailUrl);
      });
    } else {
      this.configUrl = sessionStorage.getItem('helpUrl');
      this.emailUrl = sessionStorage.getItem('emailUrl');
    }
    this.helpForm = this.fb.group({
      configUrl: ['', [Validators.required]],
      emailUrl: ['', [Validators.required]],
    });
    this.notiForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      contact: ['', [Validators.required]],
    });

    this.validateForm = new FormGroup({
      idNumber: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.navigationModelChangeSubscription = this.navigationService.onNavigationModelChange.subscribe((navigation) => {
      this.role = JSON.parse(localStorage.getItem('currentUser')).role;
      const menuChildren = navigation.filter((result) => result.id === 'administrator')[0].children;
      this.navigationModel = navigation.filter((result) => {
        // return result.role.includes(this.role) === true;
        return result.role.indexOf(this.role) !== -1;
      });
      if ([UserRole.countryAdmin, UserRole.regionalAdmin, UserRole.globalAdmin].indexOf(this.role) !== -1) {
        const children = menuChildren.filter((result) => result.role.indexOf(this.role) !== -1);
        for (const item in this.navigationModel) {
          if (this.navigationModel[item].id === 'administrator') {
            this.navigationModel[item].children = children;
            break;
          }
        }
      }
      // console.log(this.navigationModel);
    });
    if (!sessionStorage.getItem('hasRead')) {
      this.notice();
    }
    this.userName = JSON.parse(localStorage.getItem('currentUser')).name;
    switch (JSON.parse(localStorage.getItem('currentUser')).role) {
      case UserRole.user: {
        this.userRole = 'User';
        break;
      }
      case UserRole.keyUser: {
        this.userRole = 'Key User';
        break;
      }
      case UserRole.countryAdmin: {
        this.userRole = 'Country Admin';
        break;
      }
      case UserRole.regionalAdmin: {
        this.userRole = 'Regional Admin';
        break;
      }
      case UserRole.globalAdmin: {
        this.userRole = 'Global Admin';
        break;
      }
    }
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.getTitle();
  }

  ngAfterViewInit(): void {
    this.navigationService.pathStatus.subscribe(() => {
      setTimeout(() => {
        this.getTitle();
      });
    });
  }

  ngOnDestroy() {
    this.navigationModelChangeSubscription.unsubscribe();
  }

  onActivate(scrollContainer: { scrollTop: number }) {
    scrollContainer.scrollTop = 0;
  }

  getTitle() {
    let titles = this.location.prepareExternalUrl(this.location.path());
    const titlesAry = titles.split('/');
    let detailURL = '';
    if (titles.charAt(0) === '#') {
      titles = titles.slice(2);
    }

    if (titles.indexOf('detail/') > -1) {
      detailURL = titlesAry[titlesAry.length - 2];
    } else {
      // detailURL = titlesAry.slice( 1 , 3 ).pop();
      detailURL = titlesAry[titlesAry.length - 1];
    }
    const parentURL = titles.split(detailURL)[0];
    const crumbs = [];
    let crumbsTmp = {};

    // console.log('detailURL', detailURL);

    for (const item of this.listTitles) {
      if (item.path === detailURL) {
        for (let i = 0; i < item.title.split('>').length; i++) {
          crumbsTmp = {};
          if (i !== item.title.split('>').length - 1) {
            crumbsTmp['name'] = item.title.split('>')[i];
            crumbsTmp['linkUrl'] = '/' + parentURL;
            // crumbs += `<span [routerLink]="['${parentURL}']">${item.title.split('>')[i]} > </span>`
          } else {
            // crumbs += `<span>${item.title.split('>')[i]}</span>`
            crumbsTmp['name'] = item.title.split('>')[i];
          }
          crumbs.push(crumbsTmp);
        }
      }
    }
    this.crumbsHTML = crumbs;
  }

  logout() {
    // localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('login_module');
    // localStorage.removeItem('filterList');
    // localStorage.removeItem('sortList');
    // localStorage.removeItem('initStatus');
    // localStorage.removeItem('viewId');
    this.router.navigate(['/logout']);
  }

  searchIDNumber(obj: { idNumber: any }) {
    const isInvalid = this.validateForm.invalid;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (isInvalid) {
      return;
    }
    this.openSnackBar('After a successful search, a download will be prepared in the background. Please be patient, due to the amount of data.', '');
    this.paramObj['queryString'] = obj.idNumber;
    this.export(this.paramObj);
  }

  notice() {
    this.title = '';
    this.content = '';
    this.contact = '';
    this.sharedService.showLoading()
    this.helpService.getNoti().subscribe((result) => {
      this.sharedService.hideLoading()
      const data = result['data'];
      if (data.active === true) {
        this.showNoti = true;
        this.noticeActive = true;
      } else {
        if (this.role === UserRole.globalAdmin) {
          this.showNoti = true;
        } else {
          this.showNoti = false;
        }
        this.noticeActive = false;
      }
      this.title = data.title;
      this.content = data.content;
      this.contact = data.createByName;
      this.notiForm.get('title').setValue(data.title);
      this.notiForm.get('content').setValue(data.content);
      if (this.role !== UserRole.globalAdmin) {
        this.notiForm.get('contact').setValue(data.createByName);
      } else if (data.createByName === JSON.parse(localStorage.getItem('currentUser')).fullName) {
        this.notiForm.get('contact').setValue(data.createByName);
        this.notiMaintain = true;
      } else {
        this.notiForm
          .get('contact')
          .setValue(JSON.parse(localStorage.getItem('currentUser')).fullName + '\xa0(' + JSON.parse(localStorage.getItem('currentUser')).email + ')');
        this.notiMaintain = true;
      }
      sessionStorage.setItem('hasRead', data.title);
    });
  }

  previewNotice() {
    this.title = this.notiForm.value.title;
    this.content = this.notiForm.value.content;
    this.contact = this.notiForm.value.contact;
  }

  helpLink() {
    window.open(this.configUrl, '_blank');
  }

  openDialog() {
    const dialogRef = this.dialog.open(SettingComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  resetConfig() {
    this.showModel = false;
    this.showNoti = false;
  }

  helpSetting() {
    this.showModel = true;
    this.helpForm.get('configUrl').setValue(this.configUrl);
    this.helpForm.get('emailUrl').setValue(this.emailUrl);
  }

  notiSetting() {
    this.notice();
    this.showNoti = true;
  }

  helpSubmit() {
    const isInvalid = this.helpForm.invalid;
    if (isInvalid) {
      return;
    }
    const configUrl = this.helpForm.value.configUrl;
    const emailUrl = this.helpForm.value.emailUrl;
    this.showModel = false;
    const obj = {};
    obj['id'] = 'help_page';
    obj['configUrl'] = configUrl;
    obj['emailUrl'] = emailUrl;
    this.helpForm.get('configUrl').setValue('');
    this.helpForm.get('emailUrl').setValue('');
    this.helpService.setHelpURL(obj).subscribe((result) => {
      this.configUrl = configUrl;
      this.emailUrl = emailUrl;
      sessionStorage.setItem('emailUrl', this.emailUrl);
      this.openSnackBar(result['message'], '');
    });
  }

  notiSubmit() {
    const isInvalid = this.notiForm.invalid;
    if (isInvalid) {
      return;
    }
    const title = this.notiForm.value.title;
    const content = this.notiForm.value.content;
    const contact = this.notiForm.value.contact;
    const obj = {};
    obj['title'] = title;
    obj['content'] = content;
    obj['createByName'] = contact;
    obj['active'] = this.noticeActive;
    obj['createById'] = JSON.parse(localStorage.getItem('currentUser')).id;
    obj['region'] = JSON.parse(localStorage.getItem('currentUser')).region;
    obj['country'] = JSON.parse(localStorage.getItem('currentUser')).country;
    this.helpService.setNoti(obj).subscribe((result) => {
      this.showNoti = false;
      this.openSnackBar(result['message'], '');
      this.notiForm.get('title').setValue('');
      this.notiForm.get('content').setValue('');
      this.notiForm.get('contact').setValue('');
      if (sessionStorage.getItem('hasRead') !== title) {
        sessionStorage.removeItem('hasRead');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: SNACKBAR_DURATION,
    });
  }

  export(param: {}) {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.dynamicService.exportSearch(param);
        }),
        map((response) => {
          const errorMessage = response.headers.get('Error');
          if (errorMessage) {
            this.openSnackBar(errorMessage, '');
            return;
          } else {
            const link = document.createElement('a');
            const blob = new Blob([response.body], {
              type: 'application/x-xls',
            });
            const date = new Date();
            const fileDate =
              date.getFullYear().toString() +
              pad2(date.getMonth() + 1) +
              pad2(date.getDate()) +
              pad2(date.getHours()) +
              pad2(date.getMinutes()) +
              pad2(date.getSeconds());
            link.href = window.URL.createObjectURL(blob);
            link.download = `it-rack_${fileDate}.xlsx`;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            if (window.navigator.msSaveOrOpenBlob) {
              try {
                window.navigator.msSaveOrOpenBlob(blob, link.download);
              } catch (e) {
                console.log(e);
              }
            } else {
              link.click();
              document.body.removeChild(link);
            }
            return response;
          }
        }),
        catchError(() => {
          return observableOf([]);
        })
      )
      .subscribe((response) => (response = response));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.mainWrapper.nativeElement.clientWidth > 1366) {
      this.isMenuOpen = true;
    } else {
      this.isMenuOpen = false;
    }
  }

  checkShowHelper(){
    return localStorage.getItem('login_module') === 'truck' ? true : !this.showNoti
  }
}
