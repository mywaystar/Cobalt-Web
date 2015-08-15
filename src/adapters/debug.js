Cobalt.prototype.debug_adapter = function() {
  var self = this;

  var Adapter = {
    //
    //Debug ADAPTER
    //
    init: function() {
      self.platform = {
        is: "Debug"
      };
    },
    // handle events sent by native side
    handleEvent: function(json) {

    },
    //send native stuff
    send: function(obj) {

    },
    navigateToModal: function(options) {

    },
    dismissFromModal: function(data) {

    },
    storeModalInformations: function(params) {

    },
    initStorage: function() {

    },
    //datePicker stuff
    datePicker: {

    },

    //default behaviours
    handleCallback: self.defaultBehaviors.handleCallback,
    handleUnknown: self.defaultBehaviors.handleUnknown
  };

  return Adapter;
};
