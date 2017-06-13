
window.listenOnce = (elem, type, callback) => {
  const listener = () => {
    elem.removeEventListener(type, listener);
    callback();
  };
  elem.addEventListener(type, listener);
};

window.fire = (node, evType, detail) => {
  const evt = new CustomEvent(evType, {bubbles: true, composed: true, cancelable: true, detail: detail});
  node.dispatchEvent(evt);
  return evt;
};
