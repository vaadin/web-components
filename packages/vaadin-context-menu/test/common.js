
window.listenOnce = function(elem, type, callback) {
  var listener = function() {
    elem.removeEventListener(type, listener);
    callback();
  };
  elem.addEventListener(type, listener);
};

window.fire = function(node, evType, detail) {
  const evt = new CustomEvent(evType, {bubbles: true, composed: true, cancelable: true, detail: detail});
  node.dispatchEvent(evt);
  return evt;
};
