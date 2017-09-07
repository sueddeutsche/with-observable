# withObservable

> Small and simple observable pattern.

- enforces event-name registration on init
- observable pattern is used to clearly distinct from EventEmitter and sometimes ambigious _on_-methods
- lightweight solution


## Installation

`npm install with-observable --save`


## Usage


```js

// mixin the observable behaviour:
// myobject.observers;
// myobject.addObserver;
// myobject.addObserverOnce;
// myobject.removeObserver;
// myobject.notify;
myObject = withObservable.call(myObject, ["event_name", "another_event"]);

// register to an event
myObject.addObserver("event_name", function () {
	// do something
});

// register to an event once
myObject.addObserver("event_name", function () {
	// do something, will never be called again
});

// prioritize an event listener (gets executed first)
myObject.addObserver("event_name", function () {
	// do something
}, true);

// stop observing given callback
myObject.addObserver("event_name", callback);

// register event (should be used within myobject)
myObject.notify("event_name", "and", "params");

// contains callbacks by events
myObject.observers

```


## Recommendations

Within a Constructor use the mixin as follows

```
AClass.UPDATE_EVENT = "update";
AClass.END_EVENT = "end";

function AClass() {
    withObservable.call(this, [AClass.UPDATE_EVENT, AClass.END_EVENT]);
}
```

This ensures that

- The event names are accessible from outside
- refactoring of eventnames is simple
- better overview of actual events
- calling withObservable in constructor prevents conflicts





