import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentWorkpageService } from '@app/@core/services/student-workpage.service';
import { WORKPAGE_ACTION } from '@app/@core/constants';
import { StudentAssignment } from '@app/@core/models/student-workpage';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-student-workpage-give-feedback',
  templateUrl: './student-workpage-give-feedback.component.html',
  styleUrls: ['./student-workpage-give-feedback.component.scss']
})
export class StudentWorkpageGiveFeedbackComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();
  studentData: StudentAssignment
  questions = []
  questionForm: FormGroup

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private studentWorkpageService: StudentWorkpageService,
    private modalService: NzModalService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.questionForm = this.formBuilder.group({
      assignmentId: [''],
      issues: [''],
      solution: [''],
      eventEffect: [''],
      optimization: [''],
      incentives: ['']
    })

    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      this.studentWorkpageService.getAssignmentStudent(params.get('id')).subscribe(res => {
        if (!res || !res.data) this.router.navigate(['/work-page'])
        if(!this.checkAccess(res.data)) this.router.navigate(['/work-page'])

        this.questionForm.patchValue({ assignmentId: res.data.assignmentId })
        this.studentData = res.data
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  checkAccess(studentData: StudentAssignment) {
    const showBtn = this.studentWorkpageService.genNextAction(studentData.status, studentData.internalStatus, studentData.isPassed)
    return showBtn.action === WORKPAGE_ACTION.STUDENT_GIVE_FEEDBACK
  }

  get f() {
    return this.questionForm.controls;
  }

  done(): void {
    this.modalService.create({
      nzTitle: this.translateService.instant('workpage_confirmSubmit'),
      nzContent: this.translateService.instant('workpage_confirmSubmitContent'),
      nzWidth: '50%',
      nzCentered: true,
      nzOnOk: () => new Promise(resolve => {
        this.submitForm().pipe(finalize(() => resolve())).subscribe(() => this.router.navigate(['/work-page']))
      })
    })
  }

  submitForm() {
    return this.studentWorkpageService.submitGiveFeedback(this.questionForm.value)
  }
}
