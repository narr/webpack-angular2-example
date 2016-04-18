// @ src/polyfills.ts
require('core-js');
require('../src/shims_for_IE');
require('angular2/bundles/angular2-polyfills');
// src/polyfills.ts @


// @ src/vendor.ts
require('rxjs/add/operator/map');
// src/vendor.ts @


const testing = require('angular2/testing');
const browser = require('angular2/platform/testing/browser');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_APPLICATION_PROVIDERS);


// https://webpack.github.io/docs/context.html#require-context
const testsContext = require.context('../src', true, /\.spec\.ts/);
testsContext.keys().map(testsContext);
