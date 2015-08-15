Cobalt.prototype.plugins = function() {
  var self = this;

  var Plugins = {
    /*
     all plugins must
     - have a "init" function.
     - define a "name" proprety that will identify them.
     they can
     - have a "handleEvent" function that will receive all event {type:"plugin", name:thePluginName}
     - add options to the init call to receive them when the plugin will be inited.
     */
    pluginsOptions: self.options.plugins,
    enabledPlugins: {},

    //add a plugin to the plugin list.
    register: function(plugin) {
      if (!plugin ||
           typeof plugin.name !== "string" ||
           typeof plugin.init !== "function") return;

      Plugins.enabledPlugins[plugin.name] = plugin;
    },
    init: function() {
      for (var pluginName in Plugins.enabledPlugins) {
        if (Plugins.enabledPlugins[pluginName]) {
          //init each plugin with options set at the init step.
          var options = Plugins.pluginsOptions[pluginName];
          Plugins.enabledPlugins[pluginName].init(options);
        }
      }
    },
    handleEvent: function(event) {
      //try to call plugin "handleEvent" function (if any).
      if (typeof event.name !== "string") {
        cobalt.log('unknown plugin event', event);
        return;
      }

      if (!Plugins.enabledPlugins[event.name]) return;
      if (!Plugins.enabledPlugins[event.name].handleEvent) return;

      try {
        Plugins.enabledPlugins[event.name].handleEvent(event);
      } catch (e) {
        self.log('failed calling "' + event.name + '" plugin handleEvent function. ', e);
      }
    }
  };

  Plugins.init();

  return Plugins;
};
