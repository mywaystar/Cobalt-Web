Cobalt.prototype.defaultBehaviors = function() {
  var self = this;

  var defaultBehaviors = {
    handleEvent: function(json) {
      self.log("received event", json.event);
      if (self.events && typeof self.events[json.event] === "function") {
        self.events[json.event](json.data, json.callback);
      } else {
        self.adapter().handleUnknown(json);
      }
    },
    handleCallback: function(json) {
      switch (json.callback) {
        default: self.tryToCallCallback(json);
        break;
      }
    },
    handleUnknown: function(json) {
      self.log('received unhandled message ', json);
    },
    navigateToModal: function(options) {
      self.send({
        type: "navigation",
        action: "modal",
        data: {
          page: options.page,
          controller: options.controller,
          data: options.data
        }
      });
    },
    dismissFromModal: function(data) {
      self.send({
        type: "navigation",
        action: "dismiss",
        data: {
          data: data
        }
      });
    },
    initStorage: function() {
      return self.storage.enable();
    }
  };

  return defaultBehaviors;
};
