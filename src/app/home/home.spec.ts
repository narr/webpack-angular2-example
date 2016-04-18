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

import { provide } from 'angular2/core';

import { Home } from './home.component';
import { Title } from './title';

describe('Home', () => {
  class MockTitle {
    getData() {
      return {
        subscribe: () => 'mockData'
      };
    }
  }

  beforeEachProviders(() => [
    provide(Title, {
      useClass: MockTitle
    }),
    Home
  ]);

  it('should have default data', inject([Home], home => {
    expect(home._localState).toEqual({ value: '' });
  }));

  it('should get data from Title Service', inject([Home], home => {
    expect(home._jsonSub).toEqual(undefined);

    home.ngOnInit();
    expect(home._jsonSub).toEqual('mockData');
  }));
});
