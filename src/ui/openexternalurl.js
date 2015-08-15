Cobalt.prototype.openExternalUrl = function(url) {
  if(!url) return;

  this.send({
    type: "intent",
    action: "openExternalUrl",
    data: { url: url }
  });
};
