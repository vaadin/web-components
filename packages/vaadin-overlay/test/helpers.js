import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';

export function escKeyDown(target) {
  keyDownOn(target, 27, [], 'Escape');
}

function fire(type, el) {
  el.dispatchEvent(new CustomEvent(type, { bubbles: true, cancelable: true, composed: true }));
}

export function click(el) {
  fire('click', el);
}

export function mousedown(el) {
  fire('mousedown', el);
}

export function mouseup(el) {
  fire('mouseup', el);
}

export function open(overlay) {
  return new Promise((resolve) => {
    overlay.addEventListener('vaadin-overlay-open', () => {
      resolve();
    });
    overlay.opened = true;
  });
}

export function close(overlay) {
  return new Promise((resolve) => {
    afterNextRender(overlay, () => {
      resolve();
    });
    overlay.opened = false;
  });
}

export function nextRender(el) {
  return new Promise((resolve) => {
    afterNextRender(el, () => {
      resolve();
    });
  });
}
