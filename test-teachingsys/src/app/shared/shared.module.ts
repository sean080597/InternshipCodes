import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { PaginationComponent } from './pagination/pagination.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from './import-modules/icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from './import-modules/ng-zorro-antd.module';
import { TreeTableComponent } from './tree-table/tree-table.component';
import { MaterialModule } from './import-modules/material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { TreeTableServersideComponent } from './tree-table-serverside/tree-table-serverside.component';
import { NgChartsModule } from 'ng2-charts';
import { NzTableModule } from 'ng-zorro-antd/table';


@NgModule({
  declarations: [
    SideMenuComponent,
    PaginationComponent,
    HeaderComponent,
    FooterComponent,
    TreeTableComponent,
    SpinnerComponent,
    TreeTableServersideComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzMenuModule,
    IconsProviderModule,
    NzLayoutModule,
    TranslateModule,
    RouterModule,
    NgZorroAntdModule,
    MaterialModule,
    NgChartsModule,
    NzTableModule
  ],
  exports: [
    SideMenuComponent,
    PaginationComponent,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    NzMenuModule,
    IconsProviderModule,
    NzLayoutModule,
    TranslateModule,
    RouterModule,
    NgZorroAntdModule,
    TreeTableComponent,
    MaterialModule,
    SpinnerComponent,
    TreeTableServersideComponent,
    NgChartsModule,
    NzTableModule
  ]
})
export class SharedModule { }
