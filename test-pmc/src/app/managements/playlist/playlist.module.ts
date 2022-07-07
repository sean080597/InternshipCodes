import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistRoutingModule } from './playlist-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { PlaylistComponent } from './playlist.component';
import { PlaylistFormComponent } from './playlist-form/playlist-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { ImagesRegisterModule } from '../images-register/images-register.module';
import { ReceiptModule } from '../receipt/receipt.module';


@NgModule({
  declarations: [
    PlaylistComponent,
    PlaylistFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    PlaylistRoutingModule,
    ImagesRegisterModule,
    ReceiptModule
  ]
})
export class PlaylistModule { }
