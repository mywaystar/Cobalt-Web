Cobalt.android_adapter.protoype = function() {
  var self = this;

  var Adapter = {
    //
    //IOS ADAPTER
    //
    pipeline: [], //array of sends waiting to go to native
    pipelineRunning: false, //bool to know if new sends should go to pipe or go to native

    isBelowIOS7: false,

    init: function() {
      self.platform = {
        is: "iOS"
      };

      if (typeof self.iewController === "undefined") {
        self.log('Warning : self.iewController undefined. We probably are below ios7.');
        adapter.isBelowIOS7 = true;
      } else {
        adapter.isBelowIOS7 = false;
      }
    },
    // handle callbacks sent by native side
    handleCallback: function(json) {
      if (Adapter.isBelowIOS7) {
        Adapter.ios6.handleCallback(json);
      } else {
        self.defaultBehaviors.handleCallback(json);
      }
    },
    //send native stuff
    send: function(obj) {
      if (Adapter.isBelowIOS7) {
        Adapter.ios6.send(obj);
      } else {
        if (obj && !self.debugInBrowser) {
          self.divLog('sending', obj);
          try {
            self.iewController.onCobaltMessage(JSON.stringify(obj));
          } catch (e) {
            self.log('ERROR : cant connect to native.' + e);
          }

        }
      }
    },
    //datePicker stuff
    datePicker: {
      init: function(inputs) {
        self.utils.each(inputs, function() {
          var input = this;
          var id = self.utils.attr(input, 'id');

          var placeholder = self.utils.attr(input, 'placeholder');
          if (placeholder) {
            self.utils.append(document.head, '<style> #' + id + ':before{ content:"' + placeholder + '"; ' + self.datePicker.placeholderStyles + ' } #' + id + ':focus:before,#' + id + '.not_empty:before{ content:none }</style>');
          }

          input.addEventListener('change', self.datePicker.updateFromValue, false);
          input.addEventListener('keyup', self.datePicker.updateFromValue, false);
        });
      }
    },

    ios6: {
      // iOS < 7 is using an old-school url change hack to send messages from web to native.
      // Because of the url change, only one message can be sent to the native at a time.
      // The acquitement sent by native once each event has been received ensure this behavior.
      // Messages are queued and sent one after the other as soon as the acq is received.
      handleCallback: function(json) {
        switch (json.callback) {
          case "callbackSimpleAcquitment":
            self.divLog("received message acquitement");
            Adapter.ios6.unpipe();
            if (Adapter.pipeline.length === 0) {
              self.divLog('end of ios message stack');
              Adapter.pipelineRunning = false;
            }
            break;
          default:
            self.tryToCallCallback(json);
            break;
        }
      },
      send: function(obj) {
        self.divLog('adding to ios message stack', obj);
        Adapter.pipeline.push(obj);
        if (!Adapter.pipelineRunning) {
          Adapter.ios6.unpipe();
        }
      },
      //unpipe elements when receiving a ACK from ios.
      unpipe: function() {
        Adapter.pipelineRunning = true;
        var objToSend = Adapter.pipeline.shift();
        if (objToSend && !self.debugInBrowser) {
          self.divLog('sending', objToSend);
          document.location.href = encodeURIComponent("cob@l7#k&y" + JSON.stringify(objToSend));
        }
      }
    },

    //default behaviours
    handleEvent: self.defaultBehaviors.handleEvent,
    handleUnknown: self.defaultBehaviors.handleUnknown,
    navigateToModal: self.defaultBehaviors.navigateToModal,
    dismissFromModal: self.defaultBehaviors.dismissFromModal,
    initStorage: self.defaultBehaviors.initStorage
  };
  return Adapter;
};
