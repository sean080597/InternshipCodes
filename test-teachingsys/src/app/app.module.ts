import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN, en_US } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SharedModule } from './shared/shared.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GlobalErrorHandler } from './@core/helpers/global-error-handler';
import { ErrorInterceptor } from './@core/helpers/error.interceptor';
import { JwtInterceptor } from './@core/helpers/jwt.interceptor';
import { fakeBackendProvider } from './@core/helpers/fake-backend';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export function translateFactory(translate: TranslateService) {
  return async () => {
    translate.addLangs(['zh', 'en']);
    translate.setDefaultLang('zh');
    const selectedLang = localStorage.getItem('language') || null;
    if (!selectedLang) {
      localStorage.setItem('language', 'zh');
      const browserLang = translate.getBrowserLang() || 'zh';
      translate.use(browserLang.match(/zh|en/) ? browserLang : 'zh');
    } else {
      translate.use(selectedLang);
    }
    return new Promise<void>(resolve => {
      translate.onLangChange.subscribe(() => {
        resolve();
      });
    });
  };
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    NzLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: translateFactory, deps: [TranslateService], multi: true },
    { provide: NZ_I18N, useValue: en_US },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
