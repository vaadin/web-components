import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

export function createOverlay(text) {
  const overlay = fixtureSync('<vaadin-overlay></vaadin-overlay');
  overlay.renderer = (root) => {
    if (!root.firstChild) {
      const div = document.createElement('div');
      div.textContent = text;
      root.appendChild(div);
    }
  };
  return overlay;
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
    nextRender(overlay).then(() => {
      resolve();
    });
    overlay.opened = false;
  });
}
