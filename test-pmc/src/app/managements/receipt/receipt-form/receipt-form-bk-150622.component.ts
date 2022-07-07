import { FormControl } from '@angular/forms';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMON_CONFIGS, CONTENT_TYPES, DESTINATION_TYPES, HISTORY_ACTIONS, IMAGE_LIST_TYPES, INPUT_CONFIGS, LIMIT_DIMENSIONS, RECEIPT_INPUT_TYPES, SORTING_OPTS } from '@app/_constants';
import { CommonService } from '@app/_services/common.service';
import { ReceiptService } from '@app/_services/receipt.service';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, Subject, takeUntil, debounceTime, delay } from 'rxjs';
import { ModalObject } from '@app/shared/modal/modal.component';
import { ToastService } from '@app/shared/toast/toast.service';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { ReceiptContentData } from '@app/_models/receipt';
import { OperationService } from '@app/_services/operation.service';
import * as moment from 'moment';
import { ImageRegisteredService } from '@app/_services/image-registered.service';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form-bk-150622.component.html',
  styleUrls: ['./receipt-form-bk-150622.component.scss'],
})
export class ReceiptFormComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;

  private unsubscribe = new Subject<void>();
  commonConfigs = COMMON_CONFIGS
  destinationTypes = DESTINATION_TYPES;
  sortingOpts = SORTING_OPTS;
  receiptInputTypes = RECEIPT_INPUT_TYPES
  inputConfigs = INPUT_CONFIGS
  contentTypes = CONTENT_TYPES
  limitDimensions = LIMIT_DIMENSIONS

  receiptId: string
  templateId: any;
  receiptForm: FormGroup;
  selectedIndex = 0
  isEnabledArrowUp = false
  isEnabledArrowDown = false
  @ViewChild('thumbnail') thumbnailEl: ElementRef;
  @ViewChild('thumbnailChildren') thumbnailChilrenEl: ElementRef;
  tempContentDatas: ReceiptContentData[] = []
  subject = new Subject<any>();

  elementModal: ModalObject;
  deleteModal: ModalObject;
  characterInputType: string = null;
  characterInputTemp = new FormControl('');
  catchCharacterInput: string;
  selectedThumbnailImageFilePath: string;
  isEditItem = false
  confirmModal: ModalObject;
  confirmContent: string

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private receiptService: ReceiptService,
    private commonService: CommonService,
    private toast: ToastService,
    private operationService: OperationService,
    private imageRegisteredService: ImageRegisteredService,
  ) {
    this.commonService.addHeaderLeftCorner({ message: 'RECEIPT_LIST.RECEIPT_CREATION' });
    this.receiptForm = this.formBuilder.group({
      receiptLabel: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.LABEL_MAXLENGTH)]],
      remarks: ['', [Validators.maxLength(INPUT_CONFIGS.REMARKS_MAXLENGTH)]],
      thumbnail: [''],
      contentData: [[]],
      registrationDate: [''],
      lastUpdateDate: ['']
    })
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      this.templateId = this.router.getCurrentNavigation().extras.state['selectedTemplateId'];
    }
    this.subject.asObservable().pipe(delay(100), distinctUntilChanged(), takeUntil(this.unsubscribe)).subscribe(() => {
      if (this.thumbnailChilrenEl.nativeElement.offsetHeight > this.thumbnailEl.nativeElement.offsetHeight) {
        this.receiptForm.patchValue({
          contentData: this.tempContentDatas
        })
        this.toast.toastError(this.translateService.instant('ERR_MSG_EXCEEDED_MAX_HEIGTH', { height: 800 }))
      }
    });

    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault()
    if (event.key === 'ArrowDown') {
      this.moveDown();
    }
    if (event.key === 'ArrowUp') {
      this.moveUp();
    }
  }

  ngOnInit() {
    this.commonService.setScreenID(this.receiptId ? SCREEN_IDS.ADS04004 : SCREEN_IDS.ADS04011)
    this.initElementModal()
    this.initDeleteModal()
    this.initConfirmModal();

    // handling param id
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      if (params['id']) {
        this.receiptId = params['id']
        this.getImageDetailsByReceiptId(params['id'])
      }
    })

    // handling template id
    if (this.templateId) {
      this.getImageDetailsByTemplateId(this.templateId)
    }

    // handling auto format textarea
    this.characterInputTemp.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((characterInput: string) => {
      if (!characterInput) {
        return;
      }
      let category = 0;
      if (this.characterInputType === this.receiptInputTypes.STANDARD) {
        category = INPUT_CONFIGS.HALF_INPUT_STANDARD;
      }
      if (this.characterInputType === this.receiptInputTypes.FOUR_TIMES) {
        category = INPUT_CONFIGS.HALF_INPUT_4TIMES;
      }
      const inputTemp = characterInput.replace(/\t/g, ' '.repeat(4))
      const breakLineRegex = inputTemp.split(COMMON_CONFIGS.BREAK_LINE_REGEX)
      const data = this.commonService.splitStrOrArray(breakLineRegex, category);

      if (inputTemp !== this.catchCharacterInput) {
        this.catchCharacterInput = inputTemp;
        this.characterInputTemp.setValue(data.join('\n'));
      }
    });
  }

  ngAfterViewInit(): void {
    this.commonService.setActionsBarTemplate(this.actionsBar)
  }

  ngAfterViewChecked(): void {
    this.subject.next(this.thumbnailChilrenEl.nativeElement.offsetHeight)
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.commonService.removeHeaderLeftCorner();
    this.commonService.setActionsBarTemplate(null)
  }

  get f() {
    return this.receiptForm.controls;
  }

  getImageDetailsByTemplateId(templateId: string) {
    this.receiptService.getReceiptTemplateDetail(templateId).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.setFormValues(res)
      this.checkEnableArrows()
    })
  }

  getImageDetailsByReceiptId(receiptId: string) {
    this.receiptService.getReceiptDetail(receiptId).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.setFormValues(res)
      this.checkEnableArrows()
    })
  }

  setFormValues(obj) {
    this.receiptForm.setValue({
      receiptLabel: obj.receiptLabel,
      remarks: obj.remarks,
      thumbnail: obj.thumbnailImageFilePath,
      contentData: obj.contentData,
      lastUpdateDate: moment(obj.lastUpdateDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM),
      registrationDate: moment(obj.registrationDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM)
    })
  }

  setClicked(idx: number) {
    this.selectedIndex = idx
    this.checkEnableArrows()
  }

  removeItem() {
    const contentData = [...this.receiptForm.value.contentData]
    contentData.splice(this.selectedIndex, 1)
    this.receiptForm.patchValue({ contentData: contentData })
    this.checkEnableArrows()
  }

  moveUp() {
    if (this.selectedIndex === 0) return
    const contentData = [...this.receiptForm.value.contentData]
    this.commonService.moveItemArray(contentData, this.selectedIndex, this.selectedIndex - 1)
    this.selectedIndex -= 1
    this.receiptForm.patchValue({ contentData: contentData })
    this.checkEnableArrows()
  }

  moveDown() {
    const contentData = [...this.receiptForm.value.contentData]
    if (this.selectedIndex === contentData.length - 1) return
    this.commonService.moveItemArray(contentData, this.selectedIndex, this.selectedIndex + 1)
    this.selectedIndex += 1
    this.receiptForm.patchValue({ contentData: contentData })
    this.checkEnableArrows()
  }

  checkEnableArrows() {
    const contentData = [...this.receiptForm.value.contentData]
    this.isEnabledArrowUp = this.selectedIndex > 0 && this.selectedIndex < contentData.length
    this.isEnabledArrowDown = this.selectedIndex < contentData.length - 1
  }

  checkEnableAction() {
    return typeof this.receiptForm.value.contentData[this.selectedIndex] !== 'undefined'
  }

  // handling delete modal
  initDeleteModal() {
    this.deleteModal = {
      class: 'modal-md',
      title: this.translateService.instant('TT_DELETE'),
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      confirm: async () => {
        this.removeItem()
        this.deleteModal.hide();
      },
      cancel: async () => {
        this.deleteModal.hide();
      },
    };
  }

  openConfirmDeleteModal() {
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04007).subscribe()
    this.deleteModal.show()
  }
  // end handling delete modal

  // handling add/edit modal
  initElementModal() {
    this.elementModal = {
      class: 'modal-lg',
      title: this.translateService.instant('TT_ELEMENT_TYPE'),
      textConfirm: this.translateService.instant('BT_CONFIRM'),
      textCancel: this.translateService.instant('BT_CANCEL'),
      hideFooter: false,
      ignoreBackdropClick: true,
      confirm: async () => {
        this.handleCharacterInput(this.characterInputType, this.isEditItem)
        this.elementModal.hide();
      },
      cancel: async () => {
        this.elementModal.hide();
      },
    };
  }

  editItemModal() {
    this.isEditItem = true
    this.tempContentDatas = [...this.receiptForm.value.contentData]
    const selectedItem = this.receiptForm.value.contentData[this.selectedIndex]
    if (selectedItem.contentType === this.contentTypes.IMAGE) {
      this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04008).subscribe()
      this.openReceiptImageModal()
      return
    }

    this.characterInputTemp.setValue(selectedItem.data);
    let title = '';
    if (selectedItem.contentType === this.contentTypes.TEXT && selectedItem.scale === 1) {
      title = 'TT_CHARACTER_INPUT_STANDARD';
      this.characterInputType = this.receiptInputTypes.STANDARD
      this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04009).subscribe()
    } else {
      title = 'TT_CHARACTER_INPUT_4TIMES';
      this.characterInputType = this.receiptInputTypes.FOUR_TIMES
      this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04010).subscribe()
    }
    this.openElementModal(title)
  }

  addItemModal(type) {
    this.isEditItem = false
    this.characterInputTemp.reset();
    // tempContentDatas to check ngAfterViewChecked to remove the last element if over maxHeight
    this.tempContentDatas = [...this.receiptForm.value.contentData]
    this.characterInputType = type;
    let title = '';
    switch (type) {
      case this.receiptInputTypes.STANDARD:
        title = 'TT_CHARACTER_INPUT_STANDARD';
        this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04009).subscribe()
        break;
      case this.receiptInputTypes.FOUR_TIMES:
        title = 'TT_CHARACTER_INPUT_4TIMES';
        this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04010).subscribe()
        break;
      default:
        break;
    }
    this.openElementModal(title)
  }

  openReceiptImageModal() {
    this.isEditItem = false
    this.tempContentDatas = [...this.receiptForm.value.contentData]

    this.imageRegisteredService.openCreateImage({ imageListType: IMAGE_LIST_TYPES.imageListReceiptImage }, (res) => {
      if (res && res.key === 'openNewImageModal') {
        this.imageRegisteredService.openNewRegistModal({ ...res, typeIdOnly: DESTINATION_TYPES.RECEIPT_IMAGE }, (res) => {
          this.selectedThumbnailImageFilePath = res.createdImage?.imageFilePath
          this.handleCharacterInput(this.receiptInputTypes.IMAGE_SELECTION, this.isEditItem)
        })
      } else if (res && res.key === 'selectImage') {
        this.selectedThumbnailImageFilePath = res.selectedImage?.imageFilePath
        this.handleCharacterInput(this.receiptInputTypes.IMAGE_SELECTION, this.isEditItem)
      } else if (res && res.key === 'openImageSelection') {
        this.imageRegisteredService.openImageRegistListModal({typeIdOnly: DESTINATION_TYPES.RECEIPT_IMAGE}, (res) => {
          this.selectedThumbnailImageFilePath = res.selectedImage?.imageFilePath
          this.handleCharacterInput(this.receiptInputTypes.IMAGE_SELECTION, this.isEditItem)
        })
      }
    })
  }

  openElementModal(title: string) {
    this.elementModal.textConfirm = this.translateService.instant('BT_CONFIRM')
    this.elementModal.class = `modal-lg`;
    this.elementModal.title = this.translateService.instant(title);
    this.elementModal.show();
  }

  handleCharacterInput(type, isEditItem: boolean) {
    const contentDatas = this.receiptService.genContentData(type, this.characterInputTemp.value, this.selectedThumbnailImageFilePath);
    if (contentDatas.length > 0) {
      const clonedDatas = [...this.receiptForm.value.contentData]
      if (isEditItem) {
        clonedDatas.splice(this.selectedIndex, 1)
        clonedDatas.splice(this.selectedIndex, 0, ...contentDatas)
      }
      this.receiptForm.patchValue({
        contentData: isEditItem ? clonedDatas : clonedDatas.concat(contentDatas)
      })
      this.checkEnableArrows()
    }
  }
  // end handling add/edit modal

  // handling submit form
  async genImageBase64Thumbnail(el: ElementRef) {
    const limitDimensions = this.limitDimensions.find(t => t.typeId === this.destinationTypes.RECEIPT_IMAGE).dimensions
    const imgStr = await this.commonService.generateThumbnail(el, null, 'png', false, limitDimensions.width)
    this.receiptForm.patchValue({
      thumbnail: imgStr.replace(this.commonConfigs.BASE64_IMG_REGEX, "")
    })
  }

  async handleSubmitReceipt() {
    if (!this.receiptForm.valid) {
      this.commonService.validateAllFormFields(this.receiptForm)
      return
    }
    await this.genImageBase64Thumbnail(this.thumbnailEl);
    this.receiptService.createReceipt(this.receiptForm.value).pipe(takeUntil(this.unsubscribe)).subscribe((res) => {
      this.router.navigate(['/managements/receipt']);
    })
  }
  // end handling submit form

  // handling actions bar
  initConfirmModal() {
    this.confirmModal = {
      class: 'modal-lg',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      confirm: async () => {
        this.confirmModal.hide();
      },
      cancel: async () => {
        this.confirmModal.hide();
      },
    };
  }

  onBack() {
    this.router.navigate(['/managements/receipt']);
  }

  onDelete() {
    this.confirmModal.hide();
    this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS04006).subscribe()
    this.confirmContent = this.translateService.instant('MSG_RECEIPT_DELETE_CONFIRMATION')
    this.confirmModal.title = this.translateService.instant('TT_RECEIPT_DELETE_CONFIRMATION')
    this.confirmModal.confirm = async () => {
      this.receiptService.deleteReceipt(this.receiptId).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => this.router.navigate(['/managements/receipt']))
      this.confirmModal.hide();
    }
    this.confirmModal.show()
  }

  onOverwrite() {
    this.confirmModal.hide();
    this.confirmContent = this.translateService.instant('MSG_RECEIPT_OVERWRITE_CONFIRMATION')
    this.confirmModal.title = this.translateService.instant('TT_RECEIPT_OVERWRITE_CONFIRMATION')
    this.confirmModal.confirm = async () => {
      await this.genImageBase64Thumbnail(this.thumbnailEl);
      this.receiptService.updateReceipt(this.receiptId, this.receiptForm.value).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => this.router.navigate(['/managements/receipt']))
      this.confirmModal.hide();
    }
    this.confirmModal.show()
  }

  onSaveAs() {
    this.confirmModal.hide();
    this.confirmContent = this.translateService.instant('MSG_RECEIPT_SAVE_CONFIRMATION')
    this.confirmModal.title = this.translateService.instant('TT_RECEIPT_SAVE_CONFIRMATION')
    this.confirmModal.confirm = async () => {
      await this.genImageBase64Thumbnail(this.thumbnailEl);
      this.receiptService.createReceipt(this.receiptForm.value).pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => this.router.navigate(['/managements/receipt']));
      this.confirmModal.hide();
    }
    this.confirmModal.show()
  }
  // end handling actions bar
}
