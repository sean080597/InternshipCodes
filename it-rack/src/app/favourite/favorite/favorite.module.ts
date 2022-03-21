import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { FavoriteComponent } from './favorite.component';
import { FavoriteRoutingModule } from './favorite.routing';
import { CDynamicComponent } from './containerFavorite/dynamic.component';
import { SDynamicComponent } from './shipmentFavorite/dynamic.component';
import { MDynamicComponent } from './materialFavorite/dynamic.component';
import { ContainerDetailModule } from '@app/container/detail/containerDetail.module';
import { ShipmentDetailModule } from '@app/shipment/detail/shipmentDetail.module';
import { MaterialDetailModule } from '@app/material/detail/materialDetail.module';
import { ShareEmailModule } from '@app/share-email/share-email.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TruckFavoriteComponent } from './truck-favorite/truck-favorite.component';
import { TruckModule } from '@app/truck/truck.module';
import { DataDownloadingModule } from '@app/data-downloading/data-downloading.module';

@NgModule({
  imports: [
    SharedModule,
    HttpClientModule,
    FavoriteRoutingModule,
    ScrollingModule,
    ShareEmailModule,
    ContainerDetailModule,
    ShipmentDetailModule,
    MaterialDetailModule,
    TruckModule,
    DataDownloadingModule,
  ],
  declarations: [
    FavoriteComponent,
    MDynamicComponent,
    SDynamicComponent,
    CDynamicComponent,
    TruckFavoriteComponent,
    // CDetailComponent,
    // SDetailComponent,
    // MDetailComponent,
    // CContainerDialog,
    // CShipmentDialog,
    // CDeliveryDialog,
    // CMaterialDialog,
    // SContainerDialog,
    // SShipmentDialog,
    // SDeliveryDialog,
    // SMaterialDialog,
    // MContainerDialog,
    // MShipmentDialog,
    // MDeliveryDialog,
    // MMaterialDialog,
  ],
  // entryComponents: [
  //   CContainerDialog,
  //   CShipmentDialog,
  //   CDeliveryDialog,
  //   CMaterialDialog,
  //   SContainerDialog,
  //   SShipmentDialog,
  //   SDeliveryDialog,
  //   SMaterialDialog,
  //   MContainerDialog,
  //   MShipmentDialog,
  //   MDeliveryDialog,
  //   MMaterialDialog
  // ],
})
export class FavoriteModule {}
