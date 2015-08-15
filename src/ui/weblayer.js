Cobalt.prototype.webLayer = function(action, data, fadeDuration) {
  switch (action) {
    case "dismiss":
      this.send({type: "webLayer", action: "dismiss", data: data});
      break;
    case "show":
      if (!data) return;
      this.send({
        type: "webLayer",
        action: "show",
        data: { page: data, fadeDuration: fadeDuration }
      });
      break;
  }
};
