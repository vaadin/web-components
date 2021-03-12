import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

export const arrowRight = (target) => {
  keyDownOn(target, 39, [], 'ArrowRight');
};

export const arrowLeft = (target) => {
  keyDownOn(target, 37, [], 'ArrowLeft');
};

export const arrowUp = (target) => {
  keyDownOn(target, 38, [], 'ArrowUp');
};

export const arrowDown = (target) => {
  keyDownOn(target, 40, [], 'ArrowDown');
};

export const home = (target) => {
  keyDownOn(target, 36, [], 'Home');
};

export const end = (target) => {
  keyDownOn(target, 35, [], 'End');
};

export const esc = (target) => {
  keyDownOn(target, 27, [], 'Escape');
};

export const onceOpened = (element) => {
  return new Promise((resolve) => {
    const listener = (e) => {
      if (e.detail.value) {
        element.removeEventListener('opened-changed', listener);
        resolve();
      }
    };
    element.addEventListener('opened-changed', listener);
  });
};

export const isIOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const nextRender = (target) => {
  return new Promise((resolve) => {
    afterNextRender(target, () => {
      resolve();
    });
  });
};
