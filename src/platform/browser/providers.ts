/*
 * These are globally available services in any component or any other service
 */

import { provide } from 'angular2/core';

// Angular 2 Http
import { HTTP_PROVIDERS } from 'angular2/http';

// Angular 2 Router
import {
  ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy,
  PlatformLocation
} from 'angular2/router';
import { MyBrowserPlatformLocation } from './browser_platform_location';

/*
 * application_providers: providers that are global through out the application
 */
export const APPLICATION_PROVIDERS = [
  ...HTTP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  // provide(LocationStrategy, { useClass: HashLocationStrategy })

  // a temporary solution for IE9 pushState
  // https://github.com/angular/angular/issues/6506
  provide(PlatformLocation, { useClass: MyBrowserPlatformLocation }),
];

// @ for IE9
if (window && window.history && !window.history.pushState) {
  APPLICATION_PROVIDERS.push(provide(LocationStrategy, { useClass: HashLocationStrategy }));
}
// for IE9 @

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
