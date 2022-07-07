import { AbstractControl, ValidationErrors } from "@angular/forms"

export class CustomValidators {
  static comparePassword(c: AbstractControl): ValidationErrors | null {
      const pass = c.value['password']
      const matchPass = c.value['confirmPassword']
      return matchPass && pass !== matchPass ? { 'mustMatch': true } : null
  }

  static compareEmail(c: AbstractControl): ValidationErrors | null {
    const pass = c.value['userEmail']
    const matchPass = c.value['userEmailReenter']
    return matchPass && pass !== matchPass ? { 'mustMatch': true } : null
}
}
