Cobalt.prototype.storage = function() {
  var self = this;

  var Storage = {
    storage: undefined,
    enable: function() {
      var storage, fail, uid;
      try {
        uid = new Date().toString();
        storage = window.localStorage;
        storage.setItem(uid, uid);
        fail = storage.getItem(uid) != uid;
        storage.removeItem(uid);
        if(fail) storage = false;
      } catch (e) {}

      if (!storage) {
        return false;
      } else {
        Storage.storage = storage;
        return true;
      }
    },
    clear: function() {
      if (!Storage.storage) return;
      Storage.storage.clear();
    },
    set: function(uid, value) {
      if (!Storage.storage) return;
      var obj = {
        t: typeof value,
        v: value
      };

      if (obj.v instanceof Date) {
        obj.t = "date";
      }
      return Storage.storage.setItem(uid, JSON.stringify(obj));
    },
    get: function(uid) {
      if (!Storage.storage) return;

      var val = Storage.storage.getItem(uid, 'json');
      val = JSON.parse(val);
      if (val) {
        switch (val.t) {
          case "date":
            return new Date(val.v);
          default:
            return val.v;
        }
      }
      return;
    },
    remove: function(uid) {
      if (!Storage.storage) return;
      return Storage.storage.removeItem(uid);
    }
  };

  Storage.enable();

  return Storage;
};
