const MOCK_DATA_URI = require('assets/mock-data/mock-data.json');

import { Injectable } from 'angular2/core';
import { Http } from 'angular2/http';

@Injectable()
export class Title {
  constructor(private _http: Http) {}

  getData() {
    return this._http
      .get(MOCK_DATA_URI)
      .map(res => res.json());
  }
}
