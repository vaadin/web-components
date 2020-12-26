export const listenOnce = (elem, type, callback) => {
  const listener = () => {
    elem.removeEventListener(type, listener);
    callback();
  };
  elem.addEventListener(type, listener);
};

export const fire = (node, eventType, detail, eventProps) => {
  const evt = new CustomEvent(eventType, { bubbles: true, composed: true, cancelable: true, detail: detail });
  Object.assign(evt, eventProps);
  node.dispatchEvent(evt);
  return evt;
};

export const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
