import { Directive, Input, ElementRef, HostListener } from 'angular2/core';

/**
 * ### Description
 * Change backgroundColor of the element when hovering over the target
 *
 * ### Use
 * ```
 * <p [myHighlight]="{ selected: 'blue', default: 'violet' }">Highlight me!</p>
 * <p [myHighlight]="'#ffa'">Highlight me too!</p>
 * ```
 */
@Directive({
  selector: '[myHighlight]'
})
export class HighlightDirective {
  private _myHighlight: string;
  private _defaultColor = 'red';

  @Input() private set myHighlight(color: string | { selected: string, default: string }) {
    if (color) {
      if (typeof color === 'string') {
        this._myHighlight = color;
      } else {
        this._myHighlight = color.selected;
        if (color.default) {
          this._defaultColor = color.default;
        }
      }
    }
  }

  constructor(private _el: ElementRef) {
    // console.log(_el);
  }

  @HostListener('mouseenter', ['$event'])
  private onMouseEnter(event: MouseEvent) {
    // console.log(event);
    this._highlight(this._myHighlight || this._defaultColor);
  }

  @HostListener('mouseleave', ['$event'])
  private onMouseLeave(event: MouseEvent) {
    this._highlight('');
  }

  private _highlight(color: string) {
    this._el.nativeElement.style.backgroundColor = color;
  }
}
