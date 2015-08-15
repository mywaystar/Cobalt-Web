Cobalt.prototype.nativeBars = function() {
  var self = this;

  var nativeBars = {
    handlers: {},
    init : function() {

    },
    onBarButtonPressed: function(actionHandlers) {
      self.utils().extend(nativeBars.handlers, actionHandlers);
    },
    handleEvent: function(data) {
      if (data && data.action == "buttonPressed") {
        self.log('button pressed', data.button);
        if (data.button && nativeBars.handlers[data.button]) {
          nativeBars.handlers[data.button]();
        } else {
          self.log('no handler for button ', data.button);
        }
      }
    },
    send: function(data) {
      if (!data) return;
      self.send({
        type: "ui",
        control: "bars",
        data: data
      });
    },
    setVisibility: function(visibility) {
      if (!visibility || typeof visibility.top !== "undefined") {
        self.log('you should change at least one bar visibility');
        return;
      }

      nativeBars.send({
        action: "setVisibility",
        visibility: visibility
      });

    },
    showButton: function(buttonName) {
      if (!buttonName) return;

      nativeBars.send({
        action: "showButton",
        button: buttonName
      });
    },
    hideButton: function(buttonName) {
      if (!buttonName) return;
      nativeBars.send({
        action: "hideButton",
        button: buttonName
      });

    },
    setTexts: function(newTexts) {
      if (!newTexts) return;
      cobalt.nativeBars.send({
        action: "setTexts",
        texts: newTexts
      });
    }
  };

  return nativeBars;
};
