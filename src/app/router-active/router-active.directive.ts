import {
  Directive,
  OnInit,
  Input,
  Attribute,
  Query,
  QueryList,
  Renderer,
  ElementRef
} from 'angular2/core';
import { RouterLink, Router } from 'angular2/router';

/**
 * ### Description
 * RouterActive dynamically finds the first element with routerLink and toggles the active class
 *
 * ### Use
 * ```
 * <li [myRouterActive]="'activeStringValue'"><a [routerLink]="['/Home']">Home</a></li>
 * <li my-router-active="activeStringValue"><a [routerLink]="['/Home']">Home</a></li>
 * ```
 */
@Directive({
  // router-active is for @attribute director
  // as routerActive is not valid in HTML(All lowercase letters)
  selector: '[myRouterActive], [my-router-active]'
})
export class RouterActive implements OnInit {
  private _defaultRouterActiveAttr = 'active';
  @Input() private myRouterActive: string = null;

  constructor(
    @Attribute('my-router-active') private _routerActiveAttr: string,
    @Query(RouterLink) private _routerLink: QueryList<RouterLink>,
    private _renderer: Renderer,
    private _element: ElementRef,
    private _router: Router) {
    // console.log(_routerActiveAttr);
    // console.log(this._routerActiveAttr);
    this._setDefaultAttrValue(_routerActiveAttr);
  }

  ngOnInit() {
    this._routerLink.changes.subscribe(() => {
      if (this._routerLink.first) {
        this._updateClass();
        this._router.root.subscribe(() => {
          this._updateClass();
        });
      }
    });
  }

  private _setDefaultAttrValue(attr?: string) {
    // console.log(attr);
    if (attr) {
      return this._defaultRouterActiveAttr = attr;
    }
  }

  private _updateClass() {
    let active = this._routerLink.first.isRouteActive;
    // console.log(this._propOrAttr());
    this._renderer.setElementClass(this._element.nativeElement, this._propOrAttr(), active);
  }

  private _propOrAttr() {
    return this.myRouterActive || this._defaultRouterActiveAttr;
  }
}
