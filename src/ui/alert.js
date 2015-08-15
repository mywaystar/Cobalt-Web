Cobalt.prototype.alert = function(options) {
  if (!options || !options.message || !options.title) return;

  var obj={};

  if (typeof options == "string") options = { message : options } ;

  this.utils().extend(obj, {
    title : options.title,
    message : options.message,
    //ensure buttons is an array of strings or default to one Ok button
    buttons : (
      options.buttons &&
      this.utils().isArray(options.buttons) &&
      options.buttons.length
    ) ? options.buttons : ['Ok'], //only supported on Android
    cancelable : (options.cancelable) ? true : false
  });

  var callback = (
    typeof options.callback === "string" ||
    typeof options.callback === "function" ) ? options.callback : undefined;


  cobalt.send({
    type    : "ui",
    control : "alert",
    data: obj
  }, callback);

};
