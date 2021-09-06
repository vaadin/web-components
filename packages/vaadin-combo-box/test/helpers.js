import { click, mousedown, mouseup } from '@vaadin/testing-helpers';

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

export const fire = (type, node, detail) => {
  var evt = new CustomEvent(type, { detail: detail, bubbles: true, cancelable: true, composed: true });
  node.dispatchEvent(evt);

  return evt;
};

export const fireDownUpClick = (node) => {
  mousedown(node);
  mouseup(node);
  click(node);
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

/**
 * Returns the items that are inside the bounds of the given combo box's dropdown viewport.
 */
export const getViewportItems = (comboBox) => {
  const overlayRect = comboBox.$.overlay.$.dropdown.$.overlay.$.content.getBoundingClientRect();

  return Array.from(comboBox.$.overlay._selector.querySelectorAll('vaadin-combo-box-item'))
    .sort((a, b) => a.index - b.index)
    .filter((item) => !item.hidden)
    .filter((item) => {
      const itemRect = item.getBoundingClientRect();
      return itemRect.bottom > overlayRect.top && itemRect.top < overlayRect.bottom;
    });
};

/**
 * Scrolls the combo box dropdown to the given index.
 */
export const scrollToIndex = (comboBox, index) => {
  comboBox.$.overlay.__virtualizer.scrollToIndex(index);
};
