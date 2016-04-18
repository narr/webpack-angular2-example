import { Component, OnInit } from 'angular2/core';
import { RouteConfig } from 'angular2/router';

import { RouterActive } from './router-active';
import { HighlightDirective } from './highlight';

import { Home } from './home';

@Component({
  selector: 'my-app', // <my-app></my-app>
  directives: [RouterActive, HighlightDirective],
  pipes: [],
  providers: [],
  styles: [require('./app.scss').toString()],
  template: require('./app.html')
})
@RouteConfig([
  { path: '/', name: 'Index', component: Home, useAsDefault: true },
  { path: '/home', name: 'Home',  component: Home },
  { path: '/about', name: 'About', loader: () => {
    return new Promise(resolve => {
      require.ensure([], require => {
        const about = require<{About: any}>('./about/about.component');
        // console.log(about);
        resolve(about.About);
      }, 'about');
    });
  }}
])
export class App implements OnInit {
  private _appState: string;
  private _name = 'webpack-angular2-example';
  private _angularclassLogo = require('assets/img/angularclass-avatar.png');

  constructor() {
    this._appState = 'Initial App State';
  }

  ngOnInit() {
    console.log(this._appState);
  }
}
