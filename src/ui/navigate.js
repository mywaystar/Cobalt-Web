Cobalt.prototype.navigate = function(){
  var self = this;

  var Navigate = {
    push: function(options){
      if (!options || !options.page || !options.controller) return;

      self.send({
        type   : "navigation",
        action : "push",
        data : {
          page       : options.page,
          controller : options.controller,
          animated   : (options.animated !== false), //default to true
          data : options.data
        }
      });
    },

    pop: function(options){
      if (!options ||
        !options.page || !options.controller) return;

      self.send({
        type    : "navigation",
        action  : "pop",
        data: {
          data : data
        }
      });
    },

    popTo: function(options){
      if (!options || !options.page || !options.controller) return;

      self.send({
        type   : "navigation",
        action : "pop",
        data : {
          page       : options.page,
          controller : options.controller,
          data : options.data
        }
      });
    },

    replace: function(options){
      if (!options || !options.page || !options.controller) return;

      self.send({
        type   : "navigation",
        action : "replace",
        data : {
          page       : options.page,
          controller : options.controller,
          animated   : (options.animated !== false), //default to true
          data : options.data
        }
      });
    },

    modal: function(options){
      if (!options || !options.page || !options.controller) return;

      self.adapter().navigateToModal(options);
    },

    dismiss: function(options){
      if (!options || !options.page || !options.controller) return;

      self.adapter().dismissFromModal(options);
    },
  };

  return Navigate;
};
