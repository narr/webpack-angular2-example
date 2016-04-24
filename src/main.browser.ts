// require('./index.scss');

import { bootstrap } from 'angular2/platform/browser';

/*
 * directives/pipes/providers that will be available everywhere in the application.
 */
import { DIRECTIVES, PIPES, PROVIDERS } from './platform/browser';

/*
 * App Component
 * our top level component that holds all of our components
 */
import { App } from './app';

/*
 * Bootstrap the app with a top level component `App` and inject
 * Providers into Angular's dependency injection
 */
function main(): Promise<any> {
  return bootstrap(App, [
    ...DIRECTIVES,
    ...PIPES,
    ...PROVIDERS
  ]);
}

if ('development' === ENV) {
  if (true === HMR) {
    // activate hot module reload
    const ngHmr = require('angular2-hmr');
    ngHmr.hotModuleReplacement(main, module);
  } else {
    document.addEventListener('DOMContentLoaded', () => main());
  }
} else {
  require('angular2/core').enableProdMode();
  document.addEventListener('DOMContentLoaded', () => main());
}

// @ for IE9
if (window && window.history && !window.history.pushState) {
  const basePath = document.querySelector('base').getAttribute('href');
  const pathname = window.location.pathname;
  if (basePath !== pathname) {
    const href = window.location.href;
    window.location.href = href.replace(pathname, basePath);
  }
}
// for IE9 @

// to resolve a blink issue(active class - off and on) on ng-html
// as removing a loading UI after 100ms
// window.addEventListener('load', () => {
//   setTimeout(() => {
//     const loadlingEl = document.querySelector('.loading');
//     loadlingEl.parentNode.removeChild(loadlingEl);
//   }, 100);
// });
