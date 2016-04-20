import { Component, OnInit, OnDestroy } from 'angular2/core';
import { ComponentInstruction, CanReuse, OnReuse } from 'angular2/router';
import { Subscription } from 'rxjs/Subscription';

import { XLarge } from './x-large';
import { Title } from './title';

@Component({
  selector: 'home',
  directives: [XLarge],
  providers: [Title],
  template: require('./home.html')
})
export class Home implements OnInit, OnDestroy, CanReuse, OnReuse {
  private _localState = { value: '' };
  private _jsonSub: Subscription;

  constructor(private _title: Title) {}

  ngOnInit() {
    console.log('hello `Home` component');
    this._jsonSub = this._title.getData().subscribe(data => {
      console.log(data);
      // this.data = data
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    console.log('Home component is destoryed');
    this._jsonSub.unsubscribe();
  }

  // routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return false; }

  routerCanReuse(next: ComponentInstruction, prev: ComponentInstruction) { return true; }
  routerOnReuse(next: ComponentInstruction, prev: ComponentInstruction) {
    console.log('Reuse Home');
  }

  private _submitState(value) {
    console.log('submitState ', value);
  }
}
