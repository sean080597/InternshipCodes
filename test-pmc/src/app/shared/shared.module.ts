import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { RouterModule } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgZorroAntdModule } from './import-module/ng-zorro-antd.module'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ToastComponent } from './toast/toast.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PagingComponent } from './paging/paging.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import {
  StepBackwardFill,
  CaretLeftFill,
  SettingFill,
  CaretRightFill,
  StepForwardFill,
  StepBackwardOutline,
  CloseOutline,
  CloseCircleOutline,
  ReloadOutline,
  CloseCircleTwoTone,
  PlusOutline
} from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';

const icons: IconDefinition[] = [
  CloseCircleOutline,
  CloseCircleTwoTone,
  CloseOutline,
  StepBackwardFill,
  StepBackwardOutline,
  CaretLeftFill,
  CaretRightFill,
  StepForwardFill,
  SettingFill,
  AppstoreFill,
  ReloadOutline,
  PlusOutline
];
import { LeftSidebarComponent } from './header/left-sidebar/left-sidebar.component';
import { LeftSidebarOldComponent } from './header/left-sidebar-old/left-sidebar-old.component';
import { RightSidebarComponent } from './header/right-sidebar/right-sidebar.component';

import { AppstoreFill } from '@ant-design/icons-angular/icons';
import { FileDragNDropDirective } from './directives/file-drag-n-drop.directive';
import { ActionsBarComponent } from './actions-bar/actions-bar.component';

@NgModule({
  declarations: [
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    ConfirmDialogComponent,
    PaginationComponent,
    PagingComponent,
    FilterComponent,
    ModalComponent,
    ProgressIndicatorComponent,
    MaintenanceComponent,
    ToastComponent,
    LeftSidebarComponent,
    LeftSidebarOldComponent,
    RightSidebarComponent,
    FileDragNDropDirective,
    ActionsBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TranslateModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NzIconModule.forChild(icons),
    NgZorroAntdModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSpinModule,
    NzProgressModule,
    NzAlertModule,
    TypeaheadModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule.forRoot(icons)
  ],
  exports: [
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    FilterComponent,
    ConfirmDialogComponent,
    PaginationComponent,
    PagingComponent,
    ModalComponent,
    ProgressIndicatorComponent,
    NgxPaginationModule,
    NzIconModule,
    TranslateModule,
    FormsModule,
    TypeaheadModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSpinModule,
    NzProgressModule,
    ToastComponent,
    NzAlertModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    FileDragNDropDirective,
    ActionsBarComponent
  ],
  providers: [],
})
export class SharedModule { }
