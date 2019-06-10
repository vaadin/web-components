
window.listenOnce = (elem, type, callback) => {
  const listener = () => {
    elem.removeEventListener(type, listener);
    callback();
  };
  elem.addEventListener(type, listener);
};

window.fire = (node, eventType, detail, eventProps) => {
  const evt = new CustomEvent(eventType, {bubbles: true, composed: true, cancelable: true, detail: detail});
  Object.assign(evt, eventProps);
  node.dispatchEvent(evt);
  return evt;
};

window.MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
