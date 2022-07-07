import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { ReceiptTemplateComponent } from './receipt-template/receipt-template.component';
import { ReceiptFormComponent } from './receipt-form/receipt-form.component';
import { ImagesRegisterModule } from '../images-register/images-register.module';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptListModalComponent } from './receipt-list-modal/receipt-list-modal.component';
import { ReceiptDetailsModalComponent } from './receipt-details-modal/receipt-details-modal.component';


@NgModule({
  declarations: [
    ReceiptTemplateComponent,
    ReceiptFormComponent,
    ReceiptListComponent,
    ReceiptListModalComponent,
    ReceiptDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReceiptRoutingModule,
    ImagesRegisterModule
  ],
  exports: [
    ReceiptListComponent,
    ReceiptListModalComponent,
  ]
})
export class ReceiptModule { }
