import { Component, ViewEncapsulation, OnInit, Injector } from 'angular2/core';
import { RouteConfig } from 'angular2/router';

import { RouterActive } from './router-active';
import { HighlightDirective } from './highlight';

import { Home } from './home';
import { List } from './list';

import { AuthService } from './auth';

@Component({
  selector: 'my-app', // <my-app></my-app>
  directives: [RouterActive, HighlightDirective, List],
  pipes: [],
  providers: [AuthService],
  // http://blog.thoughtram.io/angular/2015/06/29/shadow-dom-strategies-in-angular2.html
  // encapsulation: ViewEncapsulation.None,
  styles: [require('./app.scss').toString()],
  template: require('./app.html')
})
@RouteConfig([
  { path: '/', name: 'Index', component: Home, useAsDefault: true },
  { path: '/home/', name: 'Home', component: Home },
  {
    path: '/about/', name: 'About', loader: () => {
      return new Promise(resolve => {
        require.ensure([], require => {
          const about = require<{ About: any }>('./about/about.component');
          // console.log(about);
          resolve(about.About);
        }, 'about');
      });
    }
  }
])
export class App implements OnInit {
  private _authService: AuthService;
  private _appState = 'Initial App State';
  private _name = 'webpack-angular2-example';
  private _angularclassLogo = require('assets/img/angularclass-avatar.png');
  private _loginState: { login: boolean };

  // constructor(private _authService: AuthService) {
  //   this._loginState = _authService.loginStatus;
  // }
  constructor(private _injector: Injector) {
    if (ENV !== 'ng-html') {
      this._authService = _injector.get(AuthService);
      this._loginState = this._authService.loginStatus;
    } else {
      this._loginState = { login: false };
    }
  }

  ngOnInit() {
    console.log(this._appState);
  }

  private _signInWithGithub() {
    this._authService.signInWithGithub()
      .then(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  private _signOut() {
    this._authService.signOut();
  }
}
