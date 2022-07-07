import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  public status: any;
  public message: any;
  public errorRespond: any;

  constructor(private router: Router, private translateService: TranslateService) {
    this.status = this.router.getCurrentNavigation().extras?.state['statusCode'] || undefined;
    this.errorRespond = this.router.getCurrentNavigation().extras?.state['error'] || undefined;
    const fieldErrors = this.errorRespond?.fieldErrors || [];
    if (fieldErrors.length > 0) { // check error BE responded array error.
      fieldErrors.forEach(err => {
        if (err?.code) {
          this.status = err.code;
          this.message = err.message;
          // const code = err.code.toUpperCase().replace('.', '_');
          // this.message = this.translateService.instant(`COMMON.ERRORS.${code}`)
        }
      });
      return;
    }

    if (fieldErrors?.code) {
      this.status = fieldErrors.code;
      this.message = fieldErrors.message;
      // const code = fieldErrors.code.toUpperCase().replace('.', '_');
      // this.message = this.translateService.instant(`COMMON.ERRORS.${code}`)
      return;
    }
    switch (this.status) {
      case 504:
        this.message = this.translateService.instant('COMMON.ERRORS.MESSAGE_504');
        break;
      case 500:
        this.message = this.translateService.instant('COMMON.ERRORS.MESSAGE_500');
        break;

      default:
        break;
    }
  }

  onRedirect(path: string[]) {
    this.router.navigate(path)
  }
}
