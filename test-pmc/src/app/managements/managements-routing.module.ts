import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { AdminGuard } from '@app/_helpers/admin.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import {ManagementsComponent} from './managements.component';
import { TopScreenComponent } from './top-screen/top-screen.component';

const UserModule = () => import('./user/user.module').then(x => x.UserModule);
const receiptModule = () => import('./receipt/receipt.module').then(x => x.ReceiptModule);
const playlistModule = () => import('./playlist/playlist.module').then(x => x.PlaylistModule);
const imagesRegisterModule = () => import('./images-register/images-register.module').then(x => x.ImagesRegisterModule);
const distributionModule = () => import('./distribution/distribution.module').then(x => x.DistributionModule);
const operationModule = () => import('./operation/operation.module').then(x => x.OperationModule);
const usageRecordModule = () => import('./usage-record/usage-record.module').then(x => x.UsageRecordModule);
const noticaManagementModule = () => import('./notica-management/notica-management.module').then(x => x.NoticaManagementModule);

const routes: Routes = [
  {path: '', component: ManagementsComponent},
  {path: 'error-page', component: ErrorPageComponent},
  {path: 'top-screen', component: TopScreenComponent},
  {path: 'user', loadChildren: UserModule},
  {path: 'receipt', loadChildren: receiptModule},
  {path: 'playlist', loadChildren: playlistModule},
  {path: 'image-gallery', loadChildren: imagesRegisterModule},
  {path: 'distribution', loadChildren: distributionModule},
  {path: 'usage-record', loadChildren: usageRecordModule},
  {path: 'operation', loadChildren: operationModule, canActivate: [AdminGuard]},
  {path: 'notica-management', loadChildren: noticaManagementModule, canActivate: [AdminGuard]},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementsRoutingModule {
}
