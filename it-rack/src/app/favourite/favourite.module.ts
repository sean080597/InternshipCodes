import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

import { NavigationModule } from './navigation/navigation.module';
import { FavouriteComponent } from './favourite.component';
import { MatIconModule } from '@angular/material/icon';
import { SettingModule } from './setting/setting.module';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule, NavigationModule, SettingModule, MatIconModule, HttpClientModule],
  declarations: [FavouriteComponent, MenuComponent],
})
export class FavouriteModule {}
