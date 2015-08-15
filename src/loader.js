//If it's android
if(navigator.userAgent.toLowerCase().indexOf("android") > -1){
 Cobalt.prototype.adapter = Cobalt.prototype.android_adapter;
}
//If it's iOS
else if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream){
  Cobalt.prototype.adapter = Cobalt.prototype.ios_adapter;
} else {
  Cobalt.prototype.adapter = Cobalt.prototype.debug_adapter;
}

window.cobalt = new Cobalt();
