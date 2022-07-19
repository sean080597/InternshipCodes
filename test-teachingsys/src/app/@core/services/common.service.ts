import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { COLOR_CLASS } from '../constants';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  readonly spinerLoading = new Subject();
  public subject = new Subject()
  listen = this.subject.asObservable()
  emit(value: any) {
    this.subject.next(value)
  }
  constructor() { }

  getFormControlName = (control: AbstractControl) => {
    let controlName = '';
    let parent = control["_parent"];
    // only such parent, which is FormGroup, has a dictionary
    // with control-names as a key and a form-control as a value
    if (parent instanceof FormGroup) {
      // now we will iterate those keys (i.e. names of controls)
      Object.keys(parent.controls).forEach((name) => {
        // and compare the passed control and
        // a child control of a parent - with provided name (we iterate them all)
        if (control === parent.controls[name]) {
          // both are same: control passed to Validator
          //  and this child - are the same references
          controlName = name;
        }
      });
    }
    // we either found a name or simply return null
    return controlName;
  }
  shallowComparison(obj1: any, obj2: any) {
    console.log(obj1);
    console.log(obj2);
    const shallowComparison =
    Object.keys(obj1).length === Object.keys(obj2).length &&
    (Object.keys(obj1) as (keyof typeof obj1)[]).every((key) => {
      return (
        Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key]
      );
    });

    // return  true when obj1 = obj2
    return shallowComparison;
  }

  showLoading() {
    this.spinerLoading.next(true);
  }

  hideLoading() {
    this.spinerLoading.next(false);
  }

  storeLearningActivityData(data: any) {
    const storedLearningActivivyData = {
      generalInformation: data.generalInformation || {},
      questions: data.questions || {},
    }
    localStorage.setItem('currentLA', JSON.stringify(storedLearningActivivyData));
    // console.log(storedLearningActivivyData);
  }

  getLearningActivityDataLocal() {
    const currentLA = localStorage.getItem('currentLA');
    if (currentLA) {
      return JSON.parse(currentLA);
    } else {
      return {};
    }
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

  convertSymbolToBlank(title: string) {
    return title?.replace((/\[#]/gi), '___');
  }

  isInt(n){
    return Number(n) === n && n % 1 === 0;
  }
  randomColor() {
    return COLOR_CLASS[Math.floor(Math.random()*COLOR_CLASS.length)]
  }
}
