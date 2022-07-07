import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '@app/_services/common.service';
import { AccountService } from '@app/_services';
import { OperationService } from '@app/_services/operation.service';
import { HISTORY_ACTIONS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';

@Component({
  selector: 'app-copyright-confirm',
  templateUrl: './copyright-confirm.component.html',
  styleUrls: ['./copyright-confirm.component.scss']
})
export class CopyrightConfirmComponent implements OnInit {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public commonService: CommonService,
    private accountService: AccountService,
    private operationService: OperationService
  ) {
    // if (this.accountService.checkExistingAgreedUser()) this.router.navigate(['/managements/top-screen'])
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      confirmOne: [false, Validators.requiredTrue],
      confirmTwo: [false, Validators.requiredTrue],
    });
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS97003).subscribe()
  }
  next() {
    if (this.form.valid) {
      this.accountService.handleCompanyPermissionModal()
      this.accountService.saveAgreedUser()
      // this.commonService.isOpenMenuSidebar.next(true); // it not used in this sprint
      this.router.navigate(['/managements/top-screen']);
    }
  }
}
