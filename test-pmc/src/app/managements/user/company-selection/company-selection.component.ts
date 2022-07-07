import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { INPUT_CONFIGS } from '@app/_constants';
import { CommonService } from '@app/_services/common.service';
import { UserService } from '@app/_services/user.service';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-company-selection',
  templateUrl: './company-selection.component.html',
  styleUrls: ['./company-selection.component.scss']
})
export class CompanySelectionComponent implements OnInit {
  form!: FormGroup;
  submitted: false;
  pagingConfig = {
    availablePages: 1,
    availableElements: 1,
    itemsPerPage: 120,
    currentPage: 1,
  }
  filterSettings = {
    displayPerPage: true,

  }
  @Input() filterSource
  filterSources = {

  };
  companyList: any = [];
  selectedCompany: any;
  onSelectedCompany
  displayPerPage = this.pagingConfig.itemsPerPage;
  private options;

  constructor(private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private userService: UserService,
    private commonService: CommonService,
  ) {
    this.onSelectedCompany = this.modalService.config.initialState
  }

  ngOnInit(): void {
    this.userService.getCompanyList().subscribe(res => {
      this.companyList = res.items;
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availableElements = res.availableElements;
    })
    this.form = this.formBuilder.group({
      searchBox: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.MAXLENGTH_64)]]
    });
    this.form.get('searchBox').valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        this.options = {
          ...this.filterSources,
          companyName: value.trim(),
          pageSize: this.pagingConfig.itemsPerPage,
        };
        this.search(this.options);
      });
  }

  get f() {
    return this.form.controls;
  }

  filterChange(e) {

  }


  backToList() {
    this.bsModalRef.hide();
  }

  clear() {
    if(this.onSelectedCompany?.companyName === '' || !this.onSelectedCompany?.companyName){
      this.submit()
    }
    this.form.setValue({ searchBox: '' });
    this.onSelectedCompany = {
      companyName: '',
      id: ''
    };
    this.selectedCompany = this.onSelectedCompany
  }

  chooseCompany(conpany) {
    this.onSelectedCompany = conpany
  }

  search(options) {
    this.commonService.validateAllFormFields(this.form)
    this.userService.getCompanyList(options).subscribe((res) => {
      this.companyList = res.items;
      this.pagingConfig.availablePages = res.availablePages
      this.pagingConfig.currentPage = res.page;
      this.pagingConfig.availableElements = res.availableElements;
    });

  }

  close(): void {
    this.bsModalRef.content.onClose.next({ key: 'close', value: true });
    this.bsModalRef.hide();
  }

  submit() {
    this.selectedCompany = this.onSelectedCompany
    this.bsModalRef.content.onClose.next({ selectedCompany: this.selectedCompany });
    this.bsModalRef.hide();
  }

  receivePaging($event) {
    this.pagingConfig.currentPage = $event;
    this.search(this.options = {
      ...this.filterSources,
      companyName: this.form.value.searchBox.trim(),
      page: this.pagingConfig.currentPage,
      pageSize: this.pagingConfig.itemsPerPage,
    });
  }
}
