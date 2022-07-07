import { Component, HostListener, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalObject } from '@app/shared/modal/modal.component';
import { ToastService } from '@app/shared/toast/toast.service';
import { COMMON_CONFIGS, DESTINATION_TYPES, HISTORY_ACTIONS, IMAGE_LIST_TYPES, INPUT_CONFIGS } from '@app/_constants';
import { SCREEN_IDS } from '@app/_constants/screen-id';
import { CommonService } from '@app/_services/common.service';
import { ImageRegisteredService } from '@app/_services/image-registered.service';
import { OperationService } from '@app/_services/operation.service';
import { PlaylistService } from '@app/_services/playlist.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ReceiptService } from '@app/_services/receipt.service';


@Component({
  selector: 'app-playlist-form',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.scss', '../playlist.component.scss']
})
export class PlaylistFormComponent implements OnInit, OnChanges {
  @ViewChild('actionsBar', { static: true }) actionsBar: TemplateRef<any>;
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    // console.log('Back button pressed');
    this.backToList();
  }

  private unsubscribe = new Subject<void>();
  confirmModal: ModalObject;
  confirmReplaceModal: ModalObject;
  playlistId = null;
  tempPlaylistDetail;
  isDeleting = false;
  actionType = 0;
  playlistForm: FormGroup
  onEditPlaylist = false;
  inputConfigs = INPUT_CONFIGS
  defaultStandbyImage: any;
  bsModalRef: BsModalRef;
  isEdited = false;

  playlistFormData: any = {
    name: null,
    memo: null,
    images: {
      standByImages: [],
      afterPaymentImage: null,
      beforePaymentImage: null,
      receiptImage: null,
    }
  };
  isInvalidData = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private playlistService: PlaylistService,
    private commonService: CommonService,
    private toast: ToastService,
    private imageService: ImageRegisteredService,
    private operationService: OperationService,
    private receiptService: ReceiptService,
  ) {
    this.commonService.addHeaderLeftCorner({ message: 'TT_PLAYLIST_CREATION' });
    this.playlistId = this.route.snapshot.paramMap.get('id');
    this.playlistForm = this.formBuilder.group({
      playlistLabel: ['', [Validators.required, Validators.maxLength(INPUT_CONFIGS.LABEL_MAXLENGTH)]],
      remarks: ['', [Validators.maxLength(INPUT_CONFIGS.REMARKS_MAXLENGTH)]],
      registrationDate: [''],
      lastUpdateDate: [''],
      playlistData: [{
        standbyImages: [
          {
            alignment: "",
            id: null,
            imageFilePath: "",
            imageLabel: "",
            registrationDate: "",
            remarks: null,
            type: "",
          }, [Validators.required],
          {
            alignment: "",
            id: null,
            imageFilePath: "",
            imageLabel: "",
            registrationDate: "",
            remarks: null,
            type: "",
          },
          {
            alignment: "",
            id: null,
            imageFilePath: "",
            imageLabel: "",
            registrationDate: "",
            remarks: null,
            type: "",
          },
        ],
        beforePaymentImage: [{}, [Validators.required]],
        afterPaymentImage: [{}, [Validators.required]],
        receiptImage: [{}, [Validators.required]]
      }],
      beforePaymentImage: [null],
      afterPaymentImage: [null],
      receiptImage: [null]
    })
    if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
      this.tempPlaylistDetail = this.router.getCurrentNavigation().extras.state['formData'];
      this.onEditPlaylist = this.router.getCurrentNavigation().extras.state['onEditPlaylist'];
      this.playlistFormData = JSON.parse(JSON.stringify(this.tempPlaylistDetail));
      this.isInvalidData = false;
    } else {
      this.isInvalidData = true;
    }
    this.initConfirmModal();
    this.initConfirmReplaceModal();

    this.commonService.actionsBarTemplate$.pipe(takeUntil(this.unsubscribe)).subscribe(res => { if (!res) this.commonService.setActionsBarTemplate(this.actionsBar) })
  }

  ngOnInit(): void {
    this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
    if (this.playlistId && this.onEditPlaylist == false) {
      this.playlistService.getPlaylistDetail(this.playlistId).pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (res) => {
          this.playlistForm.setValue({
            playlistLabel: res.playlistLabel,
            remarks: res.remarks,
            playlistData: res.playlistData,
            beforePaymentImage: null,
            afterPaymentImage: null,
            receiptImage: null,
            lastUpdateDate: moment(res.lastUpdateDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM),
            registrationDate: moment(res.registrationDate).format(COMMON_CONFIGS.MOMENT_FORMAT_YYYY_MM_DD_s_HH_MM)
          })
          this.playlistForm.valueChanges.subscribe(
            result => {
              this.onEditPlaylist = true;
            }
          );
        }
        ,
        error: (e) => {
          if (e && e.fieldErrors.length > 0) {
            e.fieldErrors.forEach(err => {
              alert(this.translateService.instant(err.code))
            });
          }
        }
      });
    }
    if (!this.playlistId) {
      this.playlistForm.valueChanges.subscribe(
        result => {
          this.onEditPlaylist = true;
        }
      );
    }
    if (this.tempPlaylistDetail) {
      this.playlistForm.patchValue(this.tempPlaylistDetail)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isEdited = true;
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

  checkNullFormValue() {
    this.playlistFormData = this.playlistForm.value;
    if (!this.playlistFormData.playlistData.standbyImages[0]?.imageFilePath) {
      this.playlistFormData.playlistData.standbyImages[0] = {}
    }
    if (!this.playlistFormData.playlistData.standbyImages[1]?.imageFilePath) {
      this.playlistFormData.playlistData.standbyImages[1] = {}
    }
    if (!this.playlistFormData.playlistData.standbyImages[2]?.imageFilePath) {
      this.playlistFormData.playlistData.standbyImages[2] = {}
    }
    if (!this.playlistFormData.playlistData.beforePaymentImage.imageFilePath) {
      this.playlistFormData.playlistData.beforePaymentImage = {}
    }
    if (!this.playlistFormData.playlistData.afterPaymentImage.imageFilePath) {
      this.playlistFormData.playlistData.afterPaymentImage = {}
    }
    if (!this.playlistFormData.playlistData.receiptImage.thumbnailImageFilePath) {
      this.playlistFormData.playlistData.receiptImage = {}
    }
  }

  openImageSelectionModal(field, index = null) {
    this.checkNullFormValue()

    if (['standbyImages', 'beforePaymentImage', 'afterPaymentImage'].includes(field)) {
      this.operationService.saveOperationKeepCurrentScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05011).subscribe()
      this.imageService.openCreateImage({ imageListType: IMAGE_LIST_TYPES.imageListCustomerDisplay, typeIdOnly: DESTINATION_TYPES.CUSTOMER_DISPLAY }, (res) => {
        if (res && res.key === 'openNewImageModal') {
          this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
          if(res.createdImage) this.setPlaylistDataValues(res.createdImage, field, index)
        } else if (res && res.key === 'selectImage') {
          this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
          if(res.selectedImage) this.setPlaylistDataValues(res.selectedImage, field, index)
        } else if (res && res.key === 'openImageSelection') {
          this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05007).subscribe()
          const initialState = {
            typeIdOnly: DESTINATION_TYPES.CUSTOMER_DISPLAY,
            storeScreenId: this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003
          }
          this.imageService.openImageRegistListModal(initialState, (res) => {
            this.commonService.setScreenID(res.storeScreenId)
            if(res.selectedImage) {
              this.setPlaylistDataValues(res.selectedImage, field, index)
            }
          })
        }
      })
    } else if (['receiptImage'].includes(field)) {
      this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05008).subscribe()
      this.receiptService.openReceiptListModal({storeScreenId: this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003}, (res) => {
        this.commonService.setScreenID(res.storeScreenId)
        if(res.selectedImage) {
          this.setPlaylistDataValues(res.selectedImage, field, index)
        }
      })
    }
  }

  setPlaylistDataValues(imageObj, field, index = null) {
    const formData = { ...this.playlistForm.value }
    if (['standbyImages'].includes(field)) {
      formData.playlistData[field][index].imageFilePath = imageObj.imageFilePath
      formData.playlistData[field][index].id = imageObj.id
    } else if (['beforePaymentImage', 'afterPaymentImage'].includes(field)) {
      formData.playlistData[field].imageFilePath = imageObj.imageFilePath
      formData.playlistData[field].id = imageObj.id
    } else if (['receiptImage'].includes(field)) {
      formData.playlistData[field].thumbnailImageFilePath = imageObj.thumbnailImageFilePath
      formData.playlistData[field].id = imageObj.id
    }
    this.playlistForm.setValue(formData)
  }

  // redirectImageSelection(field, index = null) {
  //   this.checkNullFormValue()
  //   const currentInput = {
  //     input: field,
  //     index: index,
  //   }
  //   this.router.navigate(['managements/image-gallery/select'], { state: { currentInput: currentInput, type: 'page', formData: this.playlistFormData, returnUrl: this.router.url } });
  // }

  convertToInitForm(data) {
    delete data.beforePaymentImage;
    delete data.afterPaymentImage;
    delete data.receiptImage;
    return {
      ...data, playlistData: {
        standbyImage01: data.playlistData.standbyImages[0]?.id,
        standbyImage02: data.playlistData.standbyImages[1]?.id,
        standbyImage03: data.playlistData.standbyImages[2]?.id,
        afterPaymentImage: data.playlistData.afterPaymentImage.id,
        beforePaymentImage: data.playlistData.beforePaymentImage.id,
        receiptImage: data.playlistData.receiptImage.id,
      }
    }
  }

  initConfirmModal() {
    this.confirmModal = {
      class: 'modal-lg modal-dialog-centered',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      marginBottom: true,
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      confirm: async () => {
        this.handleSubmitAction(this.actionType);
        this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
        this.confirmModal.hide();
      },
      cancel: async () => {
        this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
        this.confirmModal.hide();
      },
    };
  }

  initConfirmReplaceModal() {
    this.imageService.getImageDetails(0).pipe(takeUntil(this.unsubscribe)).subscribe(
      (res) => {
        this.defaultStandbyImage = res
      })
    this.confirmReplaceModal = {
      class: 'modal-lg modal-dialog-centered',
      title: ' ',
      textConfirm: this.translateService.instant('BT_YES'),
      textCancel: this.translateService.instant('BT_NO'),
      contentFloatLeft: false,
      hideFooter: false,
      verticalAlign: false,
      ignoreBackdropClick: true,
      showBtnDemo: false,
      marginBottom: true,
      confirm: async () => {
        this.handleSubmitAction(this.actionType);
        this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
        this.confirmReplaceModal.hide();
      },
      cancel: async () => {
        this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
        this.confirmReplaceModal.hide();
      },
    };
  }

  clearImage(inputType, index = 0) {
    if (inputType === 'standbyImages') {
      this.playlistForm.value.playlistData.standbyImages[index] = {}
    } else {
      if (inputType === 'receiptImage') {
        this.playlistForm.value.playlistData[inputType].thumbnailImageFilePath = null
      }
      this.playlistForm.value.playlistData[inputType].imageFilePath = null
    }
    this.onEditPlaylist = true;
  }

  async handleSubmitAction(type) {
    switch (type) {
      case 1:
        await
          this.checkNullFormValue();
        this.validateAfterSubmit();
        if (this.playlistForm.valid) {
          this.commonService.setScreenID(SCREEN_IDS.ADS05004)
          this.playlistService
            .updatePlaylist(this.playlistId, this.convertToInitForm(this.playlistFormData))
            .pipe(takeUntil(this.unsubscribe)).subscribe({
              next: (res) => {
                this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_OVERWRITE'))
                this.router.navigate(['/managements/playlist'], {state: {keepSearch: false}});
              },
              error: (e) => {
                if (e && e.fieldErrors.length > 0) {
                  e.fieldErrors.forEach((err) => {
                    this.toast.toastError(this.translateService.instant(err.code));
                  });
                }
              },
            });
        }
        break;
      case 2:
        this.checkNullFormValue();
        this.validateAfterSubmit();
        if (this.playlistId == null) {
          this.actionType = type;
          if (this.playlistForm.valid) {
            if (this.playlistForm.value.playlistData.standbyImages[0]?.imageFilePath &&
              !this.playlistForm.value.playlistData.standbyImages[1]?.imageFilePath &&
              !this.playlistForm.value.playlistData.standbyImages[2]?.imageFilePath
            ) {
              this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05009).subscribe()
              this.confirmReplaceModal.textCancel = this.translateService.instant('BT_BACK');
              this.confirmReplaceModal.show();
              this.confirmReplaceModal.confirm = async () => {
                this.commonService.setScreenID(this.playlistId ? SCREEN_IDS.ADS05004 : SCREEN_IDS.ADS05003)
                this.playlistFormData.playlistData.standbyImages[1] = this.defaultStandbyImage
                this.confirmReplaceModal.hide();
                // this.createPlaylist();
              }
            } else {
              this.createPlaylist();
            }
          }
        } else {
          if (this.playlistForm.valid) {
            this.createPlaylist();
          }
        }
        break;
      case 3:
        this.playlistService.deletePlaylist(this.playlistId).pipe(takeUntil(this.unsubscribe)).subscribe({
          next: (res) => {
            this.toast.toastSuccess(
              this.translateService.instant('ADSET.SSC_ADSET_DELETE')
            )
            this.router.navigate(['/managements/playlist'], {state: {keepSearch: false}});
          },
          error: (e) => {
            if (e && e.fieldErrors.length > 0) {
              e.fieldErrors.forEach(err => {
                alert(this.translateService.instant(err.code))
              });
            }
          }
        });
        break;
    }
  }

  playlistAction(type) {
    this.actionType = type;
    this.confirmModal.class = 'modal-lg modal-dialog-centered';
    switch (type) {
      case 1:
        this.checkNullFormValue();
        this.validateAfterSubmit();
        if (this.playlistForm.valid) {
          if (
            !this.playlistForm.value.playlistData.standbyImages[1]?.imageFilePath && !this.playlistForm.value.playlistData.standbyImages[2]?.imageFilePath) {
            this.confirmReplaceModal.textCancel =
              this.translateService.instant('BT_BACK');
            this.confirmReplaceModal.show();
            this.confirmReplaceModal.confirm = async () => {
              this.playlistFormData.playlistData.standbyImages[1] = this.defaultStandbyImage
              // this.handleSubmitAction(this.actionType);
              this.confirmReplaceModal.hide();
            };
            this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05009).subscribe()
          } else {
            this.handleSubmitAction(this.actionType);
          }
        } else {
          this.commonService.validateAllFormFields(this.playlistForm)
        }
        break;
      case 2:
        this.checkNullFormValue();
        this.validateAfterSubmit();
        if (this.playlistForm.valid) {
          if (!this.playlistForm.value.playlistData.standbyImages[1]?.imageFilePath && !this.playlistForm.value.playlistData.standbyImages[2]?.imageFilePath) {
            this.confirmReplaceModal.textCancel = this.translateService.instant('BT_BACK');
            this.confirmReplaceModal.show();
            this.confirmReplaceModal.confirm = async () => {
              this.playlistFormData.playlistData.standbyImages[1] = this.defaultStandbyImage
              // this.handleSubmitAction(this.actionType);
              this.confirmReplaceModal.hide();
            }
            this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05009).subscribe()
          } else {
            this.handleSubmitAction(this.actionType);
          }
        }
        else {
          this.commonService.validateAllFormFields(this.playlistForm)
        }
        break;
      case 3:
        // this.confirmModal.title = this.translateService.instant('BT_DELETE');
        this.operationService.saveOperationWithScreenId(HISTORY_ACTIONS.DISPLAY, SCREEN_IDS.ADS05006).subscribe()
        this.confirmModal.show();
        break;
    }

  }

  validateAfterSubmit() {
    this.playlistForm.markAllAsTouched();
    if (!this.playlistFormData.playlistData.standbyImages[0]?.imageFilePath) {
      this.playlistForm.controls['playlistData'].setErrors({ 'required': true });
    }
    if (!this.playlistFormData.playlistData.beforePaymentImage.imageFilePath) {
      this.playlistForm.controls['beforePaymentImage'].setErrors({ 'required': true });
    }
    if (!this.playlistFormData.playlistData.afterPaymentImage.imageFilePath) {
      this.playlistForm.controls['afterPaymentImage'].setErrors({ 'required': true });
    }
    if (!this.playlistFormData.playlistData.receiptImage.thumbnailImageFilePath) {
      this.playlistForm.controls['receiptImage'].setErrors({ 'required': true });
    }
  }
  createPlaylist() {
    this.commonService.setScreenID(SCREEN_IDS.ADS05003)
    this.playlistService
      .createPlaylist(this.convertToInitForm(this.playlistFormData))
      .pipe(takeUntil(this.unsubscribe)).subscribe({
        next: (res) => {
          if (!this.playlistId) {
            this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_CREATE'))
          }
          else {
            this.toast.toastSuccess(this.translateService.instant('ADSET.SSC_ADSET_SAVE_AS'))
          }
          this.router.navigate(['/managements/playlist'], {state: {keepSearch: false}});
        },
        error: (e) => {
          if (e && e.fieldErrors?.length > 0) {
            e.fieldErrors.forEach((err) => {
              this.toast.toastError(this.translateService.instant(err.code));
            });
          }
        },
      });
  }
  backToList() {
    this.router.navigate(['/managements/playlist'], {state: {keepSearch: true}})
  }
}
