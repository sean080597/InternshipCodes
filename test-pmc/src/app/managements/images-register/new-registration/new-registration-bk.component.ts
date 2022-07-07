import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/toast/toast.service';
import { COMMON_CONFIGS, DESTINATION_TYPES, INPUT_CONFIGS, LIMIT_DIMENSIONS, SCALEMODE_VALUES, SCALE_MODES } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-registration',
  template: '<div></div>'
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
  isProgressing$ = this.imageRegisteredService.progressing$
  progressingCount$ = this.imageRegisteredService.progressingPercent$
  progressingStatus$ = this.imageRegisteredService.progressingStatus$

  destinationImage: string
  typeId: string
  registrationForm: FormGroup
  defaultChosenImage = "/assets/images/175x105.png"
  chosenImage: string
  fileName: string = null;
  isFreeze = false;
  compressedImg: File
  scale2transform: number = 1

  constructor(
    private router: Router,
    private imageRegisteredService: ImageRegisteredService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private translateService: TranslateService,
    private toast: ToastService,
  ) {
    this.chosenImage = this.defaultChosenImage;
  }

  ngOnInit(): void {
    if(!this.isModal) {
      this.commonService.addHeaderLeftCorner({ message: 'TT_NEW_REGISTRATION_MANAGEMENT' });
    }
    this.registrationForm = this.formBuilder.group({
      imageLabel: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.LABEL_MAXLENGTH)]],
      imageFile: this.dragDropFile ? [''] : ['', [Validators.required]],
      alignment: ['', [Validators.required]],
      remarks: ['', [Validators.maxLength(INPUT_CONFIGS.REMARKS_MAXLENGTH)]],
      type: this.typeIdOnly ? [{value: this.typeIdOnly, disabled: true}] : [this.destinationTypes.CUSTOMER_DISPLAY]
    })

    if (this.dragDropFile) this.handleFileChange(this.dragDropFile)
    this.changeDesType(this.typeIdOnly ?? this.destinationTypes.CUSTOMER_DISPLAY)
    this.registrationForm.patchValue({
      alignment: this.genAlignmentOptions(this.typeId)[0].key
    })
    this.commonService.setScreenID(this.typeId === this.destinationTypes.CUSTOMER_DISPLAY ? SCREEN_IDS.ADS03006 : SCREEN_IDS.ADS03007)
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
      this.clearImageFile()
      return
    }

    const file: File = event.target.files[0];
    if (!this.imageRegisteredService.validateInputImageFile(file)) {
      this.clearImageFile()
      return
    }

    this.handleFileChange(file)
  }

  clearImageFile() {
    this.myImageFile.value = ''
    const tmp = { ...this.registrationForm.value, imageFile: '', alignment: this.genAlignmentOptions(this.typeId)[0].key }
    this.registrationForm.setValue(tmp)
    this.isFreeze = false
    this.chosenImage = this.defaultChosenImage
    this.destinationImage = this.genDestinationImage(this.typeId)
    this.fileName = null
  }

  async handleFileChange(file: File) {
    this.fileName = file.name
    this.chosenImage = await this.commonService.imageFile2Base64(file)
    this.destinationImage = this.chosenImage
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

    // for Receipt Image only
    if (this.typeId === this.destinationTypes.RECEIPT_IMAGE) {
      thumbnailEl = this.thumbnailVerEl
      const limitVerHeight = LIMIT_DIMENSIONS.find(t => t.typeId === this.destinationTypes.RECEIPT_IMAGE)?.dimensions.height
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
    if (this.registrationForm.valid) {
      this.imageRegisteredService.startProgressing()
      if (!this.compressedImg) {
        if (COMMON_CONFIGS.GIF_REGEX.test(this.fileName) && this.typeId === this.destinationTypes.CUSTOMER_DISPLAY) {
          this.compressedImg = this.commonService.imageStr2File(this.chosenImage, 'gif')
        } else {
          this.compressedImg = await this.handleCompressImage()
          if (!this.compressedImg) return
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
        .pipe(finalize(() => this.imageRegisteredService.hideProgressing()))
        .pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (res) => {
            if (this.isModal) this.onFinished.emit({typeId: this.typeId, createdImage: res})
            else if (res.id) {
              this.router.navigate(['/managements/image-gallery'])
            }
          }
        })
    } else {
      this.commonService.validateAllFormFields(this.registrationForm)
    }
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
    this.destinationImage = this.genDestinationImage(this.typeId)

    if (this.thumbnailHorEl) {
      this.scale2transform = this.genScale2Transform(this.typeId)
    }
  }

  genDestinationImage(typeId: string) {
    return this.imageRegisteredService.DISPLAY_DESTINATIONS.find(t => t.id === typeId)?.image
  }

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
}
