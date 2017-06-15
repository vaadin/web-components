
window.listenOnce = (elem, type, callback) => {
  const listener = () => {
    elem.removeEventListener(type, listener);
    callback();
  };
  elem.addEventListener(type, listener);
};

window.fire = (node, eventType, detail) => {
  const evt = new CustomEvent(eventType, {bubbles: true, composed: true, cancelable: true, detail: detail});
  node.dispatchEvent(evt);
  return evt;
};
