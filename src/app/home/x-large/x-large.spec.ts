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

import { Component, provide } from 'angular2/core';

import { XLarge } from './x-large.directive';

describe('XLarge directive', () => {
  // Create a test component to test directives
  @Component({
    template: '<div x-large>Content</div>',
    directives: [XLarge]
  })
  class TestComponent { }

  it('should sent font-size to x-large', injectAsync([TestComponentBuilder], tcb => {
    return tcb.createAsync(TestComponent).then(componentFixture => {
      const compiled = componentFixture.nativeElement.children[0];
      expect(compiled.style.fontSize).toEqual('x-large');
    });
  }));
});
