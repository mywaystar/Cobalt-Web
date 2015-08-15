Cobalt.prototype.android_adapter = function() {
  var self = this;

  var Adapter = {
    //
    //ANDROID ADAPTER
    //
    init: function() {
      self.platform = {
        is: "Android"
      };
    },
    // handle events sent by native side
    handleEvent: function(json) {
      self.log("received event", json.event);
      if (self.events && typeof self.events[json.event] === "function") {
        self.events[json.event](json.data, json.callback);
      } else {
        switch (json.event) {
          case "onBackButtonPressed":
            self.log('sending OK for a native back');
            self.sendCallback(json.callback, {
              value: true
            });
            break;
          default:
            Adapter.handleUnknown(json);
            break;
        }
      }
    },
    //send native stuff
    send: function(obj) {
      if (obj && !self.debugInBrowser) {
        self.divLog('sending', obj);
        try {
          Android.onCobaltMessage(JSON.stringify(obj));
        } catch (e) {
          self.log('ERROR : cant connect to native');
        }

      }
    },
    //modal stuffs. really basic on ios, more complex on android.
    navigateToModal: function(options) {
      self.send({
        "type": "navigation",
        "action": "modal",
        data: {
          page: options.page,
          controller: options.controller,
          data: options.data
        }
      }, 'cobalt.adapter().storeModalInformations');
    },
    dismissFromModal: function(data) {
      var dismissInformations = self.storage.get("dismissInformations");
      if (dismissInformations && dismissInformations.page && dismissInformations.controller) {
        self.send({
          "type": "navigation",
          "action": "dismiss",
          data: {
            page: dismissInformations.page,
            controller: dismissInformations.controller,
            data: data
          }
        });
        self.storage.remove("dismissInformations");
      } else {
        self.log("WANRING : dismissInformations are not available in storage");
      }

    },
    storeModalInformations: function(params) {
      self.storage.set("dismissInformations", params);
    },
    //localStorage stuff
    initStorage: function() {
      //on android, try to bind window.localStorage to Android LocalStorage
      try {
        window.localStorage = LocalStorage;
      } catch (e) {
        self.log("LocalStorage WARNING : can't find android class LocalStorage. switching to raw localStorage");
      }
      return self.storage.enable();
    },
    //datePicker stuff
    datePicker: {
      init: function(inputs) {

        self.utils().each(inputs, function() {
          var input = this;
          var id = self.utils().attr(input, 'id');

          self.log('datePicker setted with value=' + input.value);
          self.utils().attr(input, 'type', 'text');
          self.datePicker().enhanceFieldValue.apply(input);

          input.addEventListener('focus', function() {
            self.log('show formPicker date for date #', id);
            input.blur();
            var previousDate = self.storage.get('CobaltDatePickerValue_' + id);
            if (!previousDate) {
              var d = new Date();
              previousDate = {
                year: d.getFullYear(),
                day: d.getDate(),
                month: d.getMonth() + 1
              };
            }
            self.send({
              type: "ui",
              control: "picker",
              data: {
                type: "date",
                date: previousDate,
                texts: self.datePicker().texts
              }
            }, function(newDate) {
              if (newDate && newDate.year) {
                input.value = newDate.year + '-' + newDate.month + '-' + newDate.day;
                self.log('setting storage date ', newDate);
                self.storage.set('CobaltDatePickerValue_' + id, newDate);
                self.datePicker().enhanceFieldValue.apply(input);
              } else {
                self.log('removing storage date');
                input.value = "";
                self.storage.remove('CobaltDatePickerValue_' + id);
              }
            });
            return false;

          }, false);

        });
      },
      val: function(input) {
        var date = self.storage.get('CobaltDatePickerValue_' + self.utils().attr(input, 'id'));
        if (date) {
          var str_date = self.datePicker().stringifyDate(date);
          self.log('returning storage date ', str_date);
          return str_date;
        }
        return undefined;
      }
    },
    //default behaviours
    handleCallback: self.defaultBehaviors().handleCallback,
    handleUnknown: self.defaultBehaviors().handleUnknown
  };

  return Adapter;
};
