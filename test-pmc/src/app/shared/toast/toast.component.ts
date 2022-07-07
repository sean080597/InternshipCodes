import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToastService } from './toast.service';

@Component({
    selector: 'sean-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
    toasts: Toast[] = [];
    constructor(
        public toastService: ToastService,
        public router: Router
    ) {
        toastService.toasts$.subscribe((toasts) => {
            (this.toasts = toasts)
        });
    }
}
