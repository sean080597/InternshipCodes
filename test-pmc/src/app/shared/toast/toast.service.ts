import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface Toast {
    type: string;
    message: string;
    description?: string;
    navigation?: {
        name: string;
        routerUrl: string; // example: './managements/top-screen'
    }
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    toasts: Toast[] = [];
    delay = 5000;

    subject = new BehaviorSubject<Toast[]>(null);
    toasts$ = this.subject.asObservable();

    add(toast: Toast) {
        this.toasts = [toast, ...this.toasts];
        this.subject.next(this.toasts);

        setTimeout(() => {
            this.toasts = this.toasts.filter((v) => v !== toast);
            this.subject.next(this.toasts);
        }, this.delay);
    }

    remove(index: number) {
        this.toasts = this.toasts.filter((toast, i) => i !== index);
        this.subject.next(this.toasts);
    }

    public toastSuccess(message: Toast['message'], description?: Toast['description'], navigation?: Toast['navigation']): void {
        this.add({ type: 'success', message, description, navigation });
    }

    public toastError(message: Toast['message'], description?: Toast['description'], navigation?: Toast['navigation']): void {
        this.add({ type: 'error', message, description, navigation });
    }
    public toastInfo(message: Toast['message'], description?: Toast['description'], navigation?: Toast['navigation']): void {
        this.add({ type: 'info', message, description, navigation });
    }
    public toastWarning(message: Toast['message'], description?: Toast['description'], navigation?: Toast['navigation']): void {
        this.add({ type: 'warning', message, description, navigation });
    }
}
