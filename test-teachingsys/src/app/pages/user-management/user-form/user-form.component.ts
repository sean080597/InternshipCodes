import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { USER_ROLES } from '@app/@core/constants';
import { User } from '@app/@core/models/user';
import { CommonService } from '@app/@core/services/common.service';
import { UserService } from '@app/@core/services/user.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input('userData') userData: User // userData has value if user is editting
  userForm: FormGroup
  titleLs = USER_ROLES
  isSubmitting = false
  error: any
  titleList = [];

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private userService: UserService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.initUserForm(this.userData);
    this.titleList = this.titleLs.map(t => {
      return t.toLowerCase().split(' ').map((word) => {return (word.charAt(0).toUpperCase() + word.slice(1));}).join(' ');
    });
  }

  get f() {
    return this.userForm.controls;
  }

  initUserForm(userData: User) {
    this.userForm = this.formBuilder.group({
      number: [userData ? userData.number : '', [Validators.required]],
      userNameChi: [userData ? userData.userNameChi : '', [Validators.required]],
      userNameEng: [userData ? userData.userNameEng : '', [Validators.required]],
      email: [userData ? userData.email : '', [Validators.required, Validators.email]],
      phoneNumber: [userData ? userData.phoneNumber : '', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(11)]],
      title: [userData ? userData.title : '', [Validators.required]],
      password: [{ value: '123456', disabled: true }, [Validators.required]],
    })
  }

  onCancel() {
    this.modal.destroy()
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.commonService.validateAllFormFields(this.userForm)
      return
    }

    this.isSubmitting = true
    let result$: Observable<User>
    if (this.userData) {
      const sendData = { id: this.userData.id, ...this.userForm.value }
      delete sendData.title
      result$ = this.userService.updateUser(sendData)
    } else {
      result$ = this.userService.createUser(this.userForm.getRawValue())
    }
    result$.pipe(finalize(() => this.isSubmitting = false)).subscribe({
      next: () => {
        this.modal.destroy({ isSubmitted: true, title: this.userForm.value.title })
      },
      error: (err) => this.error = err
    })
  }

  checkShowErrorBE(){
    const errCases = ['phone', 'username']
    return errCases.some(t => this.error?.toLowerCase().includes(t))
  }
}
