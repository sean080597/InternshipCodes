import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMON_CONFIGS, DESTINATION_TYPES, HISTORY_ACTIONS, INPUT_CONFIGS } from '@app/_constants';
import { ImageRegistered } from '@app/_models/image-registered';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ModalObject } from '@app/shared/modal/modal.component';
import { ToastService } from '@app/shared/toast/toast.service';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { OperationService } from '@app/_services/operation.service';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss']
})
export class ImageDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    // console.log('Back button pressed');
    this.onBack();
  }
  private unsubscribe = new Subject<void>();
  destinationTypes = DESTINATION_TYPES
  inputConfigs = INPUT_CONFIGS
  imageDetails: ImageRegistered
  confirmModal: ModalObject;
  detailsForm: FormGroup
  alignmentOptions = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private imageRegisteredService: ImageRegisteredService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toast: ToastService,
    private operationService: OperationService,
  ) {
    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngOnInit(): void {
    this.commonService.setScreenID(SCREEN_IDS.ADS03003)
    this.commonService.addHeaderLeftCorner({ message: 'IMAGE_REGISTER.TT_IMAGE_DETAILS_MANAGEMENT' });
    this.initConfirmModal();

    this.detailsForm = this.formBuilder.group({
      imageLabel: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.LABEL_MAXLENGTH)]],
      remarks: ['', [Validators.maxLength(INPUT_CONFIGS.REMARKS_MAXLENGTH)]],
    })

    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      const imageId = params.get('id')
      this.imageRegisteredService.getImageDetails(imageId).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
        this.imageDetails = {
          ...res,
          registrationDate: moment(res.registrationDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM),
          lastUpdateDate: moment(res.lastUpdateDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM)
        }
        this.detailsForm.patchValue({
          imageLabel: this.imageDetails.imageLabel,
          remarks: this.imageDetails.remarks
        })
        this.alignmentOptions = this.genAlignmentOptions(this.imageDetails.type)
      })
    })
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.removeHeaderLeftCorner();
    this.commonService.setActionsBarTemplate(null)
  }

  get f() {
    return this.detailsForm.controls;
  }

  onBack() {
    this.router.navigate(['/managements/image-gallery'], {state: {keepSearch: true}})
  }

  onSave() {
    if (!this.detailsForm.valid) {
      this.commonService.validateAllFormFields(this.detailsForm)
      return
    }
    const data = {
      imageLabel: this.detailsForm.get('imageLabel')?.value,
      alignment: this.imageDetails.alignment,
      type: this.imageDetails.type,
      remarks: this.detailsForm.get('remarks')?.value,
      registrationDate: this.imageDetails.registrationDate,
    }
    this.imageRegisteredService.saveImageDetails(this.imageDetails.id, data).subscribe((res) => {
      this.toast.toastSuccess(this.translateService.instant('IMAGE_REGISTER.SCC_OPERATION_NAME_EDIT'))
      if (res.id) {
        this.router.navigate(['/managements/image-gallery'], {state: {keepSearch: false}})
      } else {
        this.toast.toastError(this.translateService.instant('ERR_MSG_OCCURRED'))
      }
    })
  }

  onDelete() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS03004).subscribe()
    this.confirmModal.show();
  }

  initConfirmModal() {
    this.confirmModal = {
      class: 'modal-md modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      marginBottom: true,
      confirm: async () => {
        this.imageRegisteredService.deleteImageDetails(this.imageDetails.id).subscribe(() => {
          this.toast.toastSuccess(this.translateService.instant('SCC_MSG_DELETED'))
          this.router.navigate(['/managements/image-gallery'], {state: {keepSearch: false}})
        })
        this.confirmModal.hide();
      },
      cancel: async () => {
        this.confirmModal.hide();
      },
    };
  }

  genAlignmentOptions(typeId: string) {
    const type = typeId === this.destinationTypes.CUSTOMER_DISPLAY ? 'customerOptions' : 'receiptOptions'
    return this.imageRegisteredService.ALIGNMENT_OPTIONS[type]
  }
}
