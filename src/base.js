/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Cobaltians
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var Cobalt = function(){

  this.version =  '0.4.1';
  this.events = {}; //Events defined by the user

  this.options = {};

  this.callbacks = {}; //array of all callbacks indexed with callbackId
  this.lastCallbackId = 0;
};

Cobalt.prototype.init = function(options){

  if(!options) options = {};

  this.options.debug          = options.debug || false;
  this.options.debugInBrowser = options.debugInBrowser || false;

  this.events                 = options.events || {};

  this.plugins.init(options.plugins || {});

  this.send({
    type     : 'cobaltIsReady',
    version  : this.version
  });
};

Cobalt.prototype.log = function(args) {
  var logString = this.utils.argumentsToString(args);

  if (!this.debug) return;

  if (this.options.debugInBrowser && window.console) console.log(logString);
  else cobalt.send({type: "log", value: logString});
};

Cobalt.prototype.addEventListener = function(eventName, handlerFunction) {
  if (typeof eventName !== "string" || typeof handlerFunction !== "function")
    return;

  this.events[eventName] = handlerFunction;
};

Cobalt.prototype.addEventListener = function(eventName, handlerFunction) {
  if (typeof eventName !== "string" || typeof handlerFunction !== "function")
    return;

  this.events[eventName] = undefined;
};

Cobalt.prototype.send = function(data, callback) {
  if (typeof data !== "object" ) return;

  if (callback) data.callback = this.registerCallback(callback);

  if (this.options.debugInBrowser) this.log('sending', data);

  this.adapter.send(data, callback);
};

Cobalt.prototype.registerCallback = function(callback) {
  var callbackId;

  if (!callback) return;

  if (typeof callback === "function") {
    callbackId = "" + (this.lastCallbackId++);
    this.callbacks[callbackId] = callback;
    this.callbacks.latest = callback;
  } else if (typeof callback === "string") {
    callbackId = callback;
  }

  return callback;
};

Cobalt.prototype.sendEvent = function(eventName, params, callback) {
  if (!eventName) return;

  var obj = {
    type: "event",
    event: eventName,
    data: params || {}
  };

  this.send(obj, callback);
};

Cobalt.prototype.sendCallback = function(callback, data) {
  if (typeof callback !== "string" || callback.length < 1) return;

  cobalt.send({
    type: "callback",
    callback: callback,
    data: data
  });

};

Cobalt.prototype.execute = function(json) {
  if (json && typeof json == "string") {
    try {
      json = JSON.parse(json);
    } catch (e) {
      cobalt.divLog("can't parse string to JSON");
    }
  }

  try {
    switch (json && json.type) {
      case "plugin":
        this.plugins.handleEvent(json);
        break;
      case "event":
        this.adapter.handleEvent(json);
        break;
      case "callback":
        this.adapter.handleCallback(json);
        break;
      case "ui":
        switch (json.control) {
          case "bars":
            this.nativeBars.handleEvent(json.data);
            break;
        }
        break;
      default:
        this.adapter.handleUnknown(json);
    }
  } catch (e) {
    cobalt.log('cobalt.execute failed : ' + e);
  }
};

Cobalt.prototype.tryToCallCallback = function(json) {
  var callbackfunction = null;

  if (this.utils.isNumber(json.callback) &&
      typeof cobalt.callbacks[json.callback] === "function") {
    //if it's a number, a real JS callback should exist in cobalt.callbacks
    callbackfunction = this.callbacks[json.callback];
  } else if (typeof json.callback === "string") {
    //if it's a string, check if function exists
    callbackfunction = eval(json.callback); // jshint ignore:line
  }

  if (typeof callbackfunction === "function") {
    try {
      callbackfunction(json.data);
    } catch (e) {
      this.log('Failed calling callback : ' + e);
    }
  } else {
    this.adapter.handleUnknown(json);
  }
};
