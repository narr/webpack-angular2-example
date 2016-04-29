// $fa-font-path: '../node_modules/font-awesome/fonts';
// $fa-font-path: '~font-awesome/fonts';
// @import '~font-awesome/scss/font-awesome.scss';
// require('font-awesome/scss/font-awesome.scss');

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap'; // flatMap
// import 'rxjs/add/operator/switchMap'; // flatMapLatest


// Angular 2
import 'angular2/platform/browser';
import 'angular2/core';
import 'angular2/http';
import 'angular2/router';


// AngularFire2
import 'angularfire2';

if ('development' === ENV && HMR === true) {
  require('angular2-hmr');
}
