/* eslint no-invalid-this: 0 */
"use strict";


function notify() {
    var event = Array.prototype.shift.apply(arguments);
    var iter;
    var count;
    var os;

    if (this.observers[event] == null) {
        throw new Error("Unknown event " + event + " for observable (" + Object.keys(this.observers).join(",") + ")");
    } else if (this.observers[event].length === 0) {
        return false;
    }

    os = this.observers[event];
    for (iter = 0, count = os.length; iter < count; iter += 1) {
        os[iter].apply(os[iter], arguments);
    }

    return true;
}

function addObserver(event, observer, prioritize) {
    if (this.observers[event] == null) {
        throw new Error("Invalid event " + event + " for observable");
    } else if (typeof observer === "function") {
        if (prioritize) {
            this.observers[event].unshift(observer);
        } else {
            this.observers[event].push(observer);
        }
    }

    return this;
}

function removeObserver(event, observer) {
    if (this.observers[event] == null) {
        return;
    }

    // reminder: creates a new array (garbage collector)
    this.observers[event] = this.observers[event].filter(function removeObs(registeredObserver) {
        return registeredObserver !== observer;
    });
}

function addObserverOnce(event, observer) {
    var self = this;

    return addObserver.call(this, event, function once() {
        removeObserver.call(self, event, once);
        observer.apply(this, arguments);
    });
}

function registerEvent(event) {
    if (Array.isArray(event)) {
        registerEvent.apply(this, event);
    } else {
        for (var i = 0, length = arguments.length; i < length; i += 1) {
            this[arguments[i]] = [];
        }
    }
}

// eslint-disable-next-line no-use-before-define
withObservable.dispose = function dispose() {
    delete this.observers;
    delete this.addObserver;
    delete this.addObserverOnce;
    delete this.removeObserver;
    delete this.notify;
};

function withObservable(eventList) {
    var observers = {};

    if (arguments.length === 0 || eventList.length === 0) {
        throw new Error("Missing eventList for observable");
    }

    for (var i = 0, length = arguments.length; i < length; i += 1) {
        registerEvent.call(observers, arguments[i]);
    }

    this.observers = observers;
    this.addObserver = addObserver;
    this.addObserverOnce = addObserverOnce;
    this.removeObserver = removeObserver;
    this.notify = notify;

    return this;
}


module.exports = withObservable;
