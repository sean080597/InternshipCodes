import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { OperationComponent } from './operation.component';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [
    OperationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OperationRoutingModule
  ]
})
export class OperationModule { }
