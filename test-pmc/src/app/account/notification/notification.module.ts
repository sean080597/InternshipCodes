import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifyComponent } from './notification.component';
import { TranslateModule } from '@ngx-translate/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { OnVisibleDirective } from '@app/shared/directives/on-visible.directive';

@NgModule({
    declarations: [NotifyComponent, OnVisibleDirective],
    imports: [CommonModule, TranslateModule, NzSpinModule],
    exports: [NotifyComponent]
})
export class  NotifyModule { }