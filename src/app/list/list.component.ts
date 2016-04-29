import { Component, OnInit, Injector, EventEmitter } from 'angular2/core';
import { FirebaseRef } from 'angularfire2';

@Component({
  selector: 'narr-list',
  directives: [],
  pipes: [],
  providers: [],
  styles: [require('./list.scss').toString()],
  template: require('./list.html')
})
export class List implements OnInit {
  private _ref: Firebase;
  private _scrollStream: EventEmitter<any> = new EventEmitter();
  private _scrollESub;
  private _isQuerying: boolean;
  private THRESHOLD_DISTANCE: number = 50;

  private _lastKey: string;
  private MAX_NUM_OF_NODE: number = 5; // The maximum number of nodes to include

  private _items: Array<number> = [];

  private _loadingWidth: string;

  // constructor( @Inject(FirebaseRef) private _ref: Firebase) { }
  constructor(private _injector: Injector) {
    if (ENV !== 'ng-html') {
      this._ref = _injector.get(FirebaseRef);
    }
  }

  ngOnInit() {
    if (ENV !== 'ng-html') {
      this._scrollListenerInit();
      this._queryData(this._lastKey).then(snapshot => {
        this._handleData(snapshot);
      }, err => {
        console.log(err);
      });
    }
  }

  // private _onScroll(event, scrollTargetEl: Element) {
  private _onScroll(event) {
    // console.log(event);
    // console.log(scrollTargetEl.clientWidth);
    if (this._loadingWidth === undefined) {
      this._loadingWidth = event.target.clientWidth + 'px';
    }
    const scrollTop = event.target.scrollTop;
    this._scrollStream.emit({
      event,
      scrollTop
    });
  }

  private _scrollListenerInit() {
    this._scrollESub = this._scrollStream
      // https://github.com/ReactiveX/rxjs/blob/master/src/operator/bufferCount.ts
      .bufferCount(2) // to get a direction value(up or down) as saving two values
      // https://github.com/ReactiveX/rxjs/blob/master/src/operator/debounceTime.ts
      .debounceTime(100) // 50ms
      .filter(eArray => {
        const target = eArray[1].event.target;
        // console.log(eArray[0].scrollTop);
        // console.log(target.scrollTop);
        // console.log(target.scrollHeight - target.offsetHeight);
        if (this._isQuerying ||
          eArray[0].scrollTop > eArray[1].scrollTop || // ignore upside scroll
          target.scrollTop < target.scrollHeight - target.offsetHeight - this.THRESHOLD_DISTANCE) {
          return false;
        }
        this._isQuerying = true;
        return true;
      })
      .mergeMap(x => {
        return <any>this._queryData(this._lastKey);
      })
      .subscribe(snapshot => {
        this._isQuerying = false;
        this._handleData(snapshot);
      }, err => {
        this._isQuerying = false;
        console.log(err);
      });
  }

  private _queryData(lastKey) {
    return this._ref
      // https://www.firebase.com/docs/web/api/query/startat.html
      .startAt(null, lastKey)
      .limitToFirst(this.MAX_NUM_OF_NODE + (this._lastKey ? 1 : this.MAX_NUM_OF_NODE))
      .once('value');
  }

  private _handleData(snapshot) {
    // console.log(snapshot.numChildren());
    snapshot.forEach(childSnapshot => {
      // console.log(childSnapshot.key());
      // console.log(childSnapshot.val());
      const key = childSnapshot.key();
      if (this._lastKey !== key) {
        this._items.push(childSnapshot.val().number);
      }
      this._lastKey = key;
    });
    if (snapshot.numChildren() < this.MAX_NUM_OF_NODE + 1) {
      this._scrollESub.unsubscribe();
    }
  }
}
