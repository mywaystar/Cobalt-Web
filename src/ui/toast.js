Cobalt.prototype.toast = function(text) {
  this.send({
    type     : "ui",
    control  : "toast",
    data: {
      message: this.utils().logToString(text)
    }
  });
};
