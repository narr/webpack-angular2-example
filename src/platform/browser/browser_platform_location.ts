/**
 * A modified version of the Angular2 src file,
 * "angular2/ts/src/router/location/browser_platform_location.ts"
 * a temporary solution for IE9 pushState
 * https://github.com/angular/angular/issues/6506
 * https://github.com/sasidhar/angular/commit/0e0f6ba15c49248cb16aef4557043c8606ce9b6d
 */

import {Injectable} from 'angular2/core';
import {History, Location} from 'angular2/src/facade/browser';
import {UrlChangeListener, PlatformLocation} from 'angular2/src/router/location/platform_location';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {isPresent} from 'angular2/src/facade/lang';

/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 */
@Injectable()
export class MyBrowserPlatformLocation extends PlatformLocation {
  private _location: Location;
  private _history: History;

  constructor() {
    super();
    this._init();
  }

  // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
  /** @internal */
  _init() {
    this._location = DOM.getLocation();
    this._history = DOM.getHistory();
  }

  /** @internal */
  get location(): Location { return this._location; }

  getBaseHrefFromDOM(): string { return DOM.getBaseHref(); }

  onPopState(fn: UrlChangeListener): void {
    DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
  }

  onHashChange(fn: UrlChangeListener): void {
    DOM.getGlobalEventTarget('window').addEventListener('hashchange', fn, false);
  }

  get pathname(): string { return this._location.pathname; }
  get search(): string { return this._location.search; }
  get hash(): string { return this._location.hash; }
  set pathname(newPath: string) { this._location.pathname = newPath; }

  pushState(state: any, title: string, url: string): void {
    if (isPresent(this._history.pushState)) {
      this._history.pushState(state, title, url);
    } else {
      this._location.hash = url;
    }
  }

  replaceState(state: any, title: string, url: string): void {
    if (isPresent(this._history.replaceState)) {
      this._history.replaceState(state, title, url);
    } else {
      this._location.hash = url;
    }
  }

  forward(): void { this._history.forward(); }

  back(): void { this._history.back(); }
}
