import { Directive, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
  selector: '[src-fallback]'
})
export class DefaultImageDirective implements OnDestroy {

  @Input('src-fallback') private srcFallback: string;
  @Output('loaded') private loaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  private el: HTMLElement;
  private isApplied: boolean = false;
  private ERROR_EVENT_TYPE: string = 'error';
  private LOAD_EVENT_TYPE: string = 'load';

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
    this.el.className = '';
    this.el.addEventListener(this.ERROR_EVENT_TYPE, this.onError.bind(this));
    this.el.addEventListener(this.LOAD_EVENT_TYPE, this.onLoad.bind(this));
  }

  public ngOnDestroy() {
    this.removeErrorEvent();
    this.removeOnLoadEvent();
  }

  private onError() {
    this.removeErrorEvent();

    if (!this.isApplied) {
      this.isApplied = true;
      this.el.setAttribute('src', this.srcFallback);
    }

    this.removeOnLoadEvent();
  }

  private onLoad() {
    this.loaded.emit(this.isApplied);
    this.el.className = 'is-loaded';
  }

  private removeErrorEvent() {
    this.el.removeEventListener(this.ERROR_EVENT_TYPE, this.onError);
  }

  private removeOnLoadEvent() {
    this.el.removeEventListener(this.LOAD_EVENT_TYPE, this.onLoad);
  }
}
