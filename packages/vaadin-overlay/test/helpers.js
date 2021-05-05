import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

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
