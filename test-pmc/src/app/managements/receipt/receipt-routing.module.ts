import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptFormComponent } from './receipt-form/receipt-form.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptTemplateComponent } from './receipt-template/receipt-template.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiptListComponent,
  },
  {
    path: 'template',
    component: ReceiptTemplateComponent
  },
  {
    path: 'create',
    component: ReceiptFormComponent
  },
  {
    path: ':id',
    component: ReceiptFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptRoutingModule { }
