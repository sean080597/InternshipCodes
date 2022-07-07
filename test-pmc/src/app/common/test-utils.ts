import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};


export function click(el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left): void {

  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

export function clickByInnerHTML(el: DebugElement, class_name: string, inner_text: string) {
  const submitBtn = el.queryAll(By.css(class_name)).find(el => el.nativeElement.innerHTML.trim() === inner_text)
  submitBtn!.triggerEventHandler('click', null)
}

export function getInputValueById(el: DebugElement, input_id: string) {
  return el.query(By.css(input_id)).nativeElement.value
}

export function getInnerTextValueById(el: DebugElement, input_id: string) {
  return el.query(By.css(input_id)).nativeElement.innerHTML
}

export function getAllListByCss(el: DebugElement, class_name: string) {
  return el.queryAll(By.css(class_name))
}

export function getDebugElByCss(el: DebugElement, class_name: string) {
  return el.query(By.css(class_name))
}

export function getNativeElByCss(el: DebugElement, class_name: string) {
  return el.query(By.css(class_name)).nativeElement
}
