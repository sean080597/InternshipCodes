import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/@core/services/auth.service';
import { CommonService } from '@app/@core/services/common.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  returnUrl: string;
  loading = false;
  error = ''

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate([this.authService.isAdmin() ? '/user-management' : '/']);
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rememberMe: [true]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl']
  }

  get f() { return this.validateForm.controls; }

  submitForm(): void {
    if (!this.validateForm.valid) {
      this.commonService.validateAllFormFields(this.validateForm)
      return
    }

    this.loading = true;
    this.authService.login(this.validateForm.value)
      .pipe(first(), finalize(() => this.loading = false))
      .subscribe((res) => {
        if (res && res.data) {
          this.returnUrl = this.returnUrl ?? (this.authService.isAdmin() ? '/user-management' : '/')
          this.router.navigate([this.returnUrl])
        } else {
          this.error = res.message
        }
      }
      )
  }
}
