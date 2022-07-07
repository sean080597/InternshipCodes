import { ElementRef, Injectable, TemplateRef } from "@angular/core"
import { FormControl, FormGroup } from "@angular/forms"
import { COMMON_CONFIGS } from "@app/_constants"
import { SCREEN_IDS } from "@app/_constants/screen-id";
import html2canvas from "html2canvas"
import { BehaviorSubject, Subject } from "rxjs";
export interface HerderLeftCorner {
  message: string;
  btnName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  commonConfigs = COMMON_CONFIGS
  readonly spinerLoading = new Subject();
  readonly isOpenMenuSidebar = new Subject();
  readonly isCloseMenuSidebar = new Subject();
  private header = new BehaviorSubject<HerderLeftCorner>(null);
  readonly btnStrikeOut = new Subject<boolean>();

  readonly header$ = this.header.asObservable();
  readonly isMaintenance = new BehaviorSubject<boolean>(true);

  private _currentFlow = new Subject<string>();
  readonly currentFlow$ = this._currentFlow.asObservable();

  public timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  private _currentScreenID = new BehaviorSubject<string>(SCREEN_IDS.ADS99001);
  readonly currentScreenID$ = this._currentScreenID.asObservable();

  private _actionsBarTemplate = new Subject<TemplateRef<any>>();
  readonly actionsBarTemplate$ = this._actionsBarTemplate.asObservable();
  private _isActionsBarOnTop = new BehaviorSubject<boolean>(false);
  readonly isActionsBarOnTop$ = this._isActionsBarOnTop.asObservable();

  private _turnOffModal = new Subject();
  readonly turnOffModal$ = this._turnOffModal.asObservable();

  constructor() {

  }

  showLoading() {
    this.spinerLoading.next(true);
    $('.overlay').addClass('active-spiner')
  }

  hideLoading() {
    this.spinerLoading.next(false);
    $('.overlay').removeClass('active-spiner')
  }

  addHeaderLeftCorner(header: HerderLeftCorner) {
    this.header.next(header);
  }

  gotoTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  addNew() {
    this.btnStrikeOut.next(true);
  }
  removeHeaderLeftCorner() {
    this.header.next(null);
  }

  setCurrentFlow(data: string){
    this._currentFlow.next(data)
  }

  setScreenID(data: string){
    this._currentScreenID.next(data)
  }

  getScreenId(){
    return this._currentScreenID.getValue()
  }

  setActionsBarTemplate(template: any) {
    this._actionsBarTemplate.next(template)
  }

  setActionsBarOnTop(isOnTop: boolean) {
    this._isActionsBarOnTop.next(isOnTop)
  }

  setTurnOffModal(isTurnOff: boolean) {
    this._turnOffModal.next(isTurnOff)
  }

  // encodeString(string: string) {
  //   if(string === null) return ''
  //   else return `?x=${encodeURIComponent(string)}`
  // }

  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string, removePrefix: boolean = false, ext: string = 'jpeg') {
    const base64Str = removePrefix ? dataURI.replace(this.commonConfigs.BASE64_IMG_REGEX, "") : dataURI
    const byteString = atob(base64Str)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const int8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    return new Blob([int8Array], { type: `image/${ext}` })
  }

  /**Method to Generate a Name for the Image */
  generateName(ext: string = 'jpeg'): string {
    const date: number = new Date().valueOf()
    let text: string = ""
    const possibleText: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      )
    }
    // Replace extension according to your media type like this
    return date + "." + text + "." + ext
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field)
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control)
      }
    })
  }

  // pass canvasEl to use grayscale method - always return png
  async generateThumbnail(el: ElementRef, canvasEl: ElementRef<HTMLCanvasElement> = null, ext: string = 'jpeg', autoRatio: boolean = true, requiredWidth?) {
    const options = this.generateCanvasOptions(el, autoRatio, requiredWidth)
    console.log('options => ', options)
    let imageStr: string = ''
    //canvas.toDataURL(): base64 string
    await html2canvas(el.nativeElement, options).then(async canvas => {
      if (canvasEl) {
        await this.image2GrayscaleOrThreshold(canvasEl, canvas.toDataURL(`image/${ext}`), true)
        imageStr = canvasEl.nativeElement.toDataURL(`image/${ext}`)
      } else {
        imageStr = canvas.toDataURL(`image/${ext}`)
      }
    }).catch(function (error) {
      console.error('oops, something went wrong!', error);
    })
    return imageStr
  }

  /*
  * chosen image: 2560 × 1600 px
  * required width: 800 - height: auto
  * => scale: ??? = 800 / 2560 = 0.3125
  */
  generateCanvasOptions(el: ElementRef, autoRatio: boolean = true, requiredWidth?) {
    const defaultOptions = { allowTaint: true, useCORS: true }
    const customOptions = {}
    let scale = window.devicePixelRatio
    if (!autoRatio) {
      const imgWidth = el.nativeElement.offsetWidth
      const imgHeight = el.nativeElement.offsetHeight
      // scale = parseFloat((requiredWidth / imgWidth).toFixed(4))
      scale = requiredWidth / imgWidth
      customOptions['width'] = imgWidth
      customOptions['height'] = imgHeight
    }
    return autoRatio ? { ...defaultOptions } : { ...defaultOptions, scale: scale, ...customOptions }
  }

  imageStr2File(imageStr: string, ext: string = 'jpeg') {
    const imageName: string = this.generateName(ext)
    const imageBlob: Blob = this.dataURItoBlob(imageStr, true, ext)
    return new File([imageBlob], imageName, { type: `image/${ext}` })
  }

  async image2GrayscaleOrThreshold(canvas: ElementRef<HTMLCanvasElement>, imageStr: string, isBlackWhite: boolean = false) {
    return new Promise(resolve => {
      const imgFile = new Image()
      imgFile.onload = (e) => {
        imgFile.crossOrigin = "anonymous"
        const ctx = canvas.nativeElement.getContext('2d')
        canvas.nativeElement.width = imgFile.width
        canvas.nativeElement.height = imgFile.height
        ctx.drawImage(imgFile, 0, 0)

        const imageData = ctx.getImageData(0, 0, imgFile.width, imgFile.height)
        if (isBlackWhite) {
          this.imageApplyThreshold(imageData)
        } else {
          this.image2Grayscale(imageData)
        }
        ctx.canvas.width = imageData.width
        ctx.canvas.height = imageData.height
        ctx.putImageData(imageData, 0, 0)
        resolve(imgFile)
      }
      imgFile.src = imageStr
    })
  }

  image2Grayscale(imageData: ImageData) {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
      data[i] = brightness
      data[i + 1] = brightness
      data[i + 2] = brightness
    }
  }

  imageApplyThreshold(imageData: ImageData, threshold: number = 128) {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      // R=G=B=R>T?255:0
      data[i] = data[i + 1] = data[i + 2] = data[i + 1] > threshold ? 255 : 0;
    }
  }

  downloadFile(blob: Blob, fileName: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }

  checkImageInfo(image: File): Promise<{ size: number, width: number, height: number }> {
    const rs = { size: 0, width: 0, height: 0 }
    return new Promise(resolve => {
      const fr = new FileReader()
      fr.onload = (e) => {
        const img = new Image()
        img.src = e.target.result as string
        img.onload = (evt) => {
          rs.width = img.width
          rs.height = img.height
          resolve(rs)
        }
      }
      fr.readAsDataURL(image)
      rs.size = image.size
    })
  }

  imageFile2Base64(image: File): Promise<string> {
    return new Promise<string>(resolve => {
      const fr = new FileReader()
      fr.onload = (e) => {
        resolve(e.target.result as string)
      }
      fr.readAsDataURL(image)
    })
  }

  moveItemArray(arr: Array<any>, itemIndex, targetIndex) {
    const itemRemoved = arr.splice(itemIndex, 1); // splice() returns the remove element as an array
    arr.splice(targetIndex, 0, itemRemoved[0]); // Insert itemRemoved into the target index
    return arr;
  }

  strLen(str: string) {
    let c = null;
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (0 <= c && c <= 25) {
        length += 0;
      } else if (32 <= c && c <= 8191) {
        length += 1;
      } else if (8192 <= c && c <= 65376) {
        length += 2;
      } else if (65377 <= c && c <= 65439) {
        length += 1;
      } else if (65440 <= c) {
        length += 2;
      }
    }
    return length;
  }

  indexOfStrLen(str: string, strLen: number) {
    if (!strLen) return -1

    let c = null;
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      c = str.charCodeAt(i);
      if (0 <= c && c <= 25) {
        length += 0;
      } else if (32 <= c && c <= 8191) {
        length += 1;
      } else if (8192 <= c && c <= 65376) {
        length += 2;
      } else if (65377 <= c && c <= 65439) {
        length += 1;
      } else if (65440 <= c) {
        length += 2;
      }

      if (length > strLen) {
        return i
      }
    }
    return -1
  }

  splitAt(index: number, xs: any[] | string) {
    return [xs.slice(0, index), xs.slice(index)]
  }

  splitStrOrArray(xs: any[] | string, halfWidth: number) {
    let result = []
    if (Array.isArray(xs)) {
      xs.forEach(str => result = result.concat(this.splitRecursive([str], halfWidth)))
    } else {
      result = result.concat(this.splitRecursive([xs], halfWidth))
    }
    return result
  }

  splitRecursive(xs: any[], halfWidth: number) {
    const tmpStr = xs[xs.length - 1]
    if (this.strLen(tmpStr) > halfWidth) {
      const idx = this.indexOfStrLen(tmpStr, halfWidth)
      const splitted = this.splitAt(idx, tmpStr)
      xs.pop()
      xs = xs.concat(splitted)
      return this.splitRecursive(xs, halfWidth)
    }
    return xs
  }
}
