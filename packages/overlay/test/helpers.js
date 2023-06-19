import { fixtureSync } from '@vaadin/testing-helpers';

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
