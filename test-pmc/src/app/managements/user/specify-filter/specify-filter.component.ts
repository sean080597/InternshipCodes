import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Users} from "@models/users";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UserService} from "@app/_services/user.service";
import {Subject} from "rxjs";
import {CompanySelectionComponent} from "@app/managements/user/company-selection/company-selection.component";

@Component({
  selector: 'app-specify-filter',
  templateUrl: './specify-filter.component.html',
  styleUrls: ['./specify-filter.component.scss']
})
export class SpecifyFilterComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  user!: Users;
  authotiryOptions: { key: number, value: string }[]
  // bsModalRef:BsModalRef;
  constructor(private formBuilder: FormBuilder,
              private bsModalRef: BsModalRef,
              private userService: UserService,
              private modalService: BsModalService
  ) {
    this.authotiryOptions = this.userService.AUTHORITY_LIST || []
  }

  ngOnInit(): void {
    this.form= this.formBuilder.group({
      email: ['', [Validators.required]],
      authority:['',[Validators.required]]
    })
  }
  get f() {
    return this.form.controls;
  }
  backToList(): void {
    this.modalService.hide();
  }
  submit():void{
    this.modalService.hide();
    // this.bsModalRef.hide();
  }
  clear():void{
    this.form.reset();

  }
  selection():void{
    this.bsModalRef = this.modalService.show(CompanySelectionComponent, {class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true});
    this.bsModalRef.content.onClose = new Subject<boolean>();
    this.bsModalRef.content.onClose.subscribe()
  }

  close(): void {
    this.bsModalRef.content.onClose.next({ key: 'close', value: true });
    this.bsModalRef.hide();
  }
}
