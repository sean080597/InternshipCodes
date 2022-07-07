import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[onVisible]'
})

export class OnVisibleDirective {

  @Output() public onVisible: EventEmitter<any> = new EventEmitter()

  private _intersectionObserver?: IntersectionObserver;

  constructor(private _element: ElementRef) { }

  public ngAfterViewInit() {
    this._intersectionObserver = new IntersectionObserver(entries => {
      this.checkForIntersection(entries);
    }, {});
    this._intersectionObserver.observe(<Element>this._element.nativeElement);
  }

  public ngOnDestroy() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
  }

  private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const isIntersecting = entry.isIntersecting && entry.target === this._element.nativeElement;

      if (isIntersecting) {
        this.onVisible.emit();
      }
    });
  };
}
