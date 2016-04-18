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

import { MockBackend, MockConnection } from 'angular2/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from 'angular2/http';
import { provide } from 'angular2/core';

import { Title } from './title.service';

describe('Title directive', () => {
  beforeEachProviders(() => [
    MockBackend,
    BaseRequestOptions,
    provide(Http, {
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),
    Title
  ]);

  it('should get data from the server', inject([MockBackend, Title],
    (mockBackend, title) => {
      let getDataCon: MockConnection;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        getDataCon = connection;
        connection.mockRespond(new Response(new ResponseOptions({
          body: {
            value: 'webpack-angular2-example'
          }
        })));
      });

      title.getData().subscribe(data => {
        expect(getDataCon.request.url).toContain('mock-data.json');
        expect(data.value).toEqual('webpack-angular2-example');
      });
    }));
});
