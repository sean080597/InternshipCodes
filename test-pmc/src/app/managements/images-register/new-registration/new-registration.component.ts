import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter, TemplateRef, AfterViewInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@app/shared/toast/toast.service';
import { COMMON_CONFIGS, DESTINATION_TYPES, HISTORY_ACTIONS, INPUT_CONFIGS, LIMIT_DIMENSIONS, SCALEMODE_VALUES, SCALE_MODES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { FilterSource } from '@app/_models/common';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { OperationService } from '@app/_services/operation.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.component.html',
  styleUrls: ['./new-registration.component.scss']
})
export class NewRegistrationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  @Input('isModal') isModal = false
  @Input('dragDropFile') dragDropFile: File;
  @Input('typeIdOnly') typeIdOnly: string;
  @Output() onFinished: EventEmitter<{typeId: string, createdImage: any}> = new EventEmitter()

  private unsubscribe = new Subject<void>();
  destinationTypes = DESTINATION_TYPES
  limitDimensions: { width: number, height: number }
  scaleModes = SCALE_MODES
  inputConfigs = INPUT_CONFIGS
  @ViewChild('canvas', { static: true }) canvasEl: ElementRef<HTMLCanvasElement>
  @ViewChild('thumbnailHorizontal') thumbnailHorEl: ElementRef;
  @ViewChild('thumbnailVertical') thumbnailVerEl: ElementRef;
  @ViewChild('myImageFile') myImageFile: HTMLInputElement;
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    // console.log('Back button pressed');
    this.onBack();
  }
  isProgressing$ = this.imageRegisteredService.progressing$
  progressingCount$ = this.imageRegisteredService.progressingPercent$
  progressingStatus$ = this.imageRegisteredService.progressingStatus$

  // destinationImage: string
  selectedFiles: FileList
  previewImage: string
  typeId: string
  registrationForm: FormGroup
  defaultChosenImage = "/assets/images/175x105.png"
  chosenImage: string
  fileName: string = null;
  isFreeze = false;
  compressedImg: File
  scale2transform: number = 1
  filterSource: FilterSource
  isSubmitting = false

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imageRegisteredService: ImageRegisteredService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private translateService: TranslateService,
    private toast: ToastService,
    private operationService: OperationService,
  ) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      this.typeIdOnly = params['typeIdOnly']
    })

    // check for passing dragDropFile after closing NewImageModal
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      this.dragDropFile = this.router.getCurrentNavigation().extras.state['dragDropFile']
    }

    this.filterSource = this.imageRegisteredService.filterSource
    this.chosenImage = this.defaultChosenImage
    this.previewImage = this.defaultChosenImage
  }

  ngOnInit(): void {
    if(!this.isModal) {
      this.commonService.addHeaderLeftCorner({ message: 'IMAGE_REGISTER.TT_IMAGE_DETAILS_MANAGEMENT' });
    }
    this.registrationForm = this.formBuilder.group({
      imageLabel: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.LABEL_MAXLENGTH)]],
      imageFile: [''],
      alignment: ['', [Validators.required]],
      remarks: ['', [Validators.maxLength(INPUT_CONFIGS.REMARKS_MAXLENGTH)]],
      type: [{ value: this.typeIdOnly ?? this.destinationTypes.CUSTOMER_DISPLAY, disabled: true }]
    })

    if (this.dragDropFile) this.handleFileChange(this.dragDropFile)
    this.changeDesType(this.typeIdOnly ?? this.destinationTypes.CUSTOMER_DISPLAY)
    this.registrationForm.patchValue({
      alignment: this.genAlignmentOptions(this.typeId)[0].key
    })
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, this.typeId === this.destinationTypes.CUSTOMER_DISPLAY ? SCREEN_IDS.ADS03006 : SCREEN_IDS.ADS03007).subscribe()
    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    if(!this.isModal) this.commonService.removeHeaderLeftCorner();
    this.commonService.setActionsBarTemplate(null)
  }

  get f() {
    return this.registrationForm.controls;
  }

  onFileChange(event) {
    this.compressedImg = null
    if (event.target.files.length < 1) {
      this.myImageFile.files = this.selectedFiles
      return
    }

    const file: File = event.target.files[0];
    if (!this.imageRegisteredService.validateInputImageFile(file)) {
      this.clearImageFile()
      return
    }

    this.selectedFiles = event.target.files
    this.handleFileChange(file)
  }

  clearImageFile() {
    this.myImageFile.value = ''
    const tmp = { ...this.registrationForm.getRawValue(), imageFile: '', alignment: this.genAlignmentOptions(this.typeId)[0].key }
    this.registrationForm.setValue(tmp)
    this.isFreeze = false
    this.chosenImage = this.defaultChosenImage
    this.previewImage = this.defaultChosenImage
    // this.destinationImage = this.getDestinationImage(this.typeId)
    this.fileName = null
  }

  onBack() {
    this.router.navigate(['/managements/image-gallery'], {state: {keepSearch: true}})
  }

  async handleFileChange(file: File) {
    this.fileName = file.name
    this.chosenImage = await this.commonService.imageFile2Base64(file)
    if (this.typeId === this.destinationTypes.CUSTOMER_DISPLAY) {
      this.previewImage = this.chosenImage
    } else {
      await this.commonService.image2GrayscaleOrThreshold(this.canvasEl, this.chosenImage, true)
      this.previewImage = this.canvasEl.nativeElement.toDataURL()
    }
    // this.destinationImage = this.chosenImage
    const imgInfo = await this.commonService.checkImageInfo(file)
    if (imgInfo.width < this.limitDimensions.width && imgInfo.height < this.limitDimensions.height) {
      this.registrationForm.patchValue({ alignment: this.genAlignmentOptions(this.typeId)[2].key })
      this.isFreeze = true
    } else {
      this.isFreeze = false
    }
  }

  async handleCompressImage() {
    let thumbnailEl: ElementRef = this.thumbnailHorEl

    // for Receipt Image only - 384x800 => ratio = 12/25
    if (this.typeId === this.destinationTypes.RECEIPT_IMAGE) {
      thumbnailEl = this.thumbnailVerEl
      const limitVerHeight = this.thumbnailHorEl.nativeElement.offsetWidth * 25 / 12
      if (this.thumbnailVerEl.nativeElement.offsetHeight > limitVerHeight) {
        thumbnailEl = this.thumbnailHorEl
      }
    }

    const imgExt = COMMON_CONFIGS.JPEG_REGEX.test(this.fileName) && this.typeId === this.destinationTypes.CUSTOMER_DISPLAY ? 'jpeg' : 'png'
    const imgCanvas = this.typeId === this.destinationTypes.CUSTOMER_DISPLAY ? null : this.canvasEl
    const imgStr = await this.commonService.generateThumbnail(thumbnailEl, imgCanvas, imgExt, false, this.limitDimensions.width)

    this.imageRegisteredService.increaseProgressing(10)
    const imgFile = this.commonService.imageStr2File(imgStr, imgExt)
    const compressedImg = await this.imageRegisteredService.compressImageSize(imgFile, this.limitDimensions.width, 0.8)
    if (!compressedImg) {
      this.toast.toastError(this.translateService.instant('ERR_MSG_COMPRESSED_NOT_100'))
      this.imageRegisteredService.hideProgressing()
    }
    return compressedImg
  }

  /*
  GIF (CUSTOMER_DISPLAY) - directly upload GIF
  JPEG (CUSTOMER_DISPLAY) - upload JPEG
  PNG (CUSTOMER_DISPLAY) - upload PNG
  JPEG/PNG/GIF(RECEIPT_IMAGE) - upload PNG Black & White
  */

  async onSave() {
    if (this.registrationForm.invalid || !this.fileName || this.isSubmitting) {
      this.commonService.validateAllFormFields(this.registrationForm)
      return
    }

    this.isSubmitting = true
    this.imageRegisteredService.startProgressing()
    if (!this.compressedImg) {
      this.compressedImg = await this.handleCompressImage()
      if (!this.compressedImg) {
        this.isSubmitting = false
        return
      }
    } else {
      this.imageRegisteredService.setProgressing(40)
    }
    const data = { ...this.registrationForm.getRawValue(), imageFile: this.compressedImg }

    let formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Blob) {
        formData.append(key, value, value['name'])
      } else {
        formData.append(key, value as string)
      }
    })

    this.imageRegisteredService.increaseProgressing(10)
    this.imageRegisteredService.submitImageRegistration(formData)
      .pipe(takeUntil(this.unsubscribe), finalize(() => (this.imageRegisteredService.hideProgressing(), this.isSubmitting = false)))
      .subscribe((res) => {
        this.toast.toastSuccess(this.translateService.instant('IMAGE_REGISTER.SCC_OPERATION_NAME_CREATE'))
        if (this.isModal) {
          this.onFinished.emit({typeId: this.typeId, createdImage: res})
        } else if (res.id) {
          this.filterSource.type = this.typeId
          this.router.navigate(['/managements/image-gallery'], {state: {keepSearch: false}})
        }
      })
  }

  genScaleModeClassname(typeId: string) {
    return this.imageRegisteredService.genScaleModeClassname(typeId, this.registrationForm.value.alignment)
  }

  changeAligment() {
    this.compressedImg = null
    if (this.thumbnailHorEl) {
      this.scale2transform = this.genScale2Transform(this.typeId)
    }
  }

  changeDesType(type: string) {
    this.compressedImg = null
    this.typeId = type
    this.limitDimensions = LIMIT_DIMENSIONS.find(t => t.typeId === type)?.dimensions
    // this.destinationImage = this.getDestinationImage(this.typeId)

    if (this.thumbnailHorEl) {
      this.scale2transform = this.genScale2Transform(this.typeId)
    }
  }

  // getDestinationImage(typeId: string) {
  //   return this.imageRegisteredService.DISPLAY_DESTINATIONS.find(t => t.id === typeId)?.image
  // }

  genAlignmentOptions(typeId: string) {
    const type = typeId === this.destinationTypes.CUSTOMER_DISPLAY ? 'customerOptions' : 'receiptOptions'
    return this.imageRegisteredService.ALIGNMENT_OPTIONS[type]
  }

  genScale2Transform(typeId: string) {
    const scaleMode = this.genScaleModeClassname(typeId)
    if ([SCALEMODE_VALUES.alignedCenter, SCALEMODE_VALUES.alignedUpperLeft, SCALEMODE_VALUES.alignedTopCenter].includes(scaleMode)) {
      return this.thumbnailHorEl.nativeElement.offsetWidth / this.limitDimensions.width
    }
    return 1
  }

  genMaxHeightReceipt(typeId: string) {
    if(!this.thumbnailHorEl) return null
    return typeId === this.destinationTypes.RECEIPT_IMAGE ? (this.thumbnailHorEl.nativeElement.offsetWidth * 25 / 12) : null
  }
}
