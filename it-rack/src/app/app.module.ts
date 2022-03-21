import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '@shared/shared.module';
import { SharedService } from '@shared/shared.service';

import { AppComponent } from './app.component';
import { FavouriteModule } from './favourite/favourite.module';
import { LogoutComponent } from './core/logout/logout.component';
import { JwtInterceptor } from './core/jwt.interceptor';
import { ErrorInterceptor } from './core/error.interceptor';
import { Page404Component } from './page404/page404.component';
import { LoginModule } from './core/login/login.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FirstTimeAccessComponent } from './first-time-access/first-time-access.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
@NgModule({
  declarations: [AppComponent, LogoutComponent, Page404Component, FirstTimeAccessComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SharedModule, FavouriteModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule, LoginModule],
  providers: [
    SharedService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
