export const TOUCH_DEVICE = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

export const createEventSpy = (type, preventDefault) => {
  // Fake a keydown event to mimic form submit.
  const event = new CustomEvent(type, {
    bubbles: true,
    cancelable: true
  });
  event.preventDefault = preventDefault;
  return event;
};

export const onceOpened = (element) => {
  return new Promise((resolve) => {
    const listener = (e) => {
      if (e.detail.value) {
        element.removeEventListener('opened-changed', listener);
        // wait for scroll position adjustment
        window.requestAnimationFrame(() => {
          resolve();
        });
      }
    };
    element.addEventListener('opened-changed', listener);
  });
};

export const onceScrolled = (scroller) => {
  return new Promise((resolve) => {
    const listener = () => {
      scroller.removeEventListener('scroll', listener);
      setTimeout(() => {
        resolve();
      });
    };
    scroller.addEventListener('scroll', listener);
  });
};

export const makeItems = (length) => {
  return Array(...new Array(length)).map((_, i) => `item ${i}`);
};
