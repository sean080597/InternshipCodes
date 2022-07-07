import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementsComponent } from './managements.component';
import { SharedModule } from '@app/shared/shared.module';
import { ManagementsRoutingModule } from './managements-routing.module';
import { TopScreenComponent } from './top-screen/top-screen.component';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  declarations: [
    ManagementsComponent,
    TopScreenComponent,
    ErrorPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManagementsRoutingModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: "ja" }]
})
export class ManagementsModule { }
