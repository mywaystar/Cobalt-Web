Cobalt.prototype.pullToRefresh = function(){
  var pullToRefresh = {
    setTexts: function (pullToRefreshText, refreshingText) {
      if (typeof pullToRefreshText != "string") pullToRefreshText = undefined;
      if (typeof refreshingText != "string") pullToRefreshText = undefined;

      this.send({
        type     : "ui",
        control  : "pullToRefresh",
        data: {
          action: "setTexts",
          texts: {
            pullToRefresh: pullToRefreshText,
            refreshing: refreshingText
          }
        }
      });
    }
  };

  return pullToRefresh;
};
