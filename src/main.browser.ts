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
