import { nextRender } from '@vaadin/testing-helpers';

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
    nextRender(overlay).then(() => {
      resolve();
    });
    overlay.opened = false;
  });
}
