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

import { About } from './about.component';

describe('About', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    About
  ]);

  it('should log ngOnInit', inject([About], about => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    about.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  }));
});
