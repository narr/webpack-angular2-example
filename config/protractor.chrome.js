require('ts-node/register');

const helpers = require('./helpers');
const SpecReporter = require('jasmine-spec-reporter');

// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
exports.config = {
  // Boolean. If true, Protractor will connect directly to the browser Drivers
  // at the locations specified by chromeDriver and firefoxPath. Only Chrome
  // and Firefox are supported for direct connect.
  directConnect: true, // https://github.com/angular/angular-phonecat/issues/276

  baseUrl: 'http://localhost:8080/',

  specs: [
    helpers.root('src/**/*.e2e.ts')
  ],
  exclude: [],

  rootElement: 'my-app',

  framework: 'jasmine2',
  jasmineNodeOpts: {
    // https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/protractor-configuration.md
    print: f => f
  },

  onPrepare: () => {
    // https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/protractor-configuration.md
    jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: 'all' }));
    browser.ignoreSynchronization = true; // for a non-angular site or for async
  },

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        // '--start-maximized' // this doesn't work
        // '--window-size=1920,1200'
      ]
    }
  }
};
