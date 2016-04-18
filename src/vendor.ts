// RxJS
import 'rxjs/add/operator/map';

// Angular 2
import 'angular2/platform/browser';
import 'angular2/core';
import 'angular2/http';
import 'angular2/router';

if ('development' === ENV && HMR === true) {
  require('angular2-hmr');
}
