import {
  afterEach,
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  inject,
  injectAsync,
  it,
  TestComponentBuilder
} from 'angular2/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import { AuthService } from './auth';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App,
    AuthService,
    ...FIREBASE_PROVIDERS,
    defaultFirebase('https://webpack-angular2-example.firebaseio.com'),
  ]);

  it('should have a name', inject([App], app => {
    // console.log(app);
    expect(app._name).toEqual('webpack-angular2-example');
  }));
});
