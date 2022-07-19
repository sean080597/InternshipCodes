import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  constructor(
    public snackBar: MatSnackBar,
    private commonService: CommonService,
    private zone: NgZone) { }

  showSuccess(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.snackBar.open(message);
    });
  }

  showError(error: any): void {
    this.zone.run(() => {
      // The second parameter is the text in the button. 
      // In the third, we send in the css class for the snack bar.
      this.snackBar.open(error.error.error.message, 'X', {panelClass: ['error']}).afterOpened().pipe(delay(500)).subscribe(() => {
        this.commonService.hideLoading();
      });
    });
  }

}