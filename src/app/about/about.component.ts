import { Component, OnInit } from 'angular2/core';

@Component({
  selector: 'about',
  styles: [`
    h1 {
      font-family: Arial, Helvetica, sans-serif
    }
  `],
  template: `
    <h1>
      https://twitter.com/nardgu
    </h1>
  `
})
export class About implements OnInit {
  ngOnInit() {
    console.log('hello `About` component');
  }
}
