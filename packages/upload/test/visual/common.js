import { nextFrame, nextRender } from '@vaadin/testing-helpers';

/**
 * Freeze the loader animation on all upload-file elements inside the given element
 * so that visual diff screenshots are deterministic.
 */
export function freezeLoaderAnimation(container) {
  container.querySelectorAll('vaadin-upload-file').forEach((file) => {
    const style = document.createElement('style');
    style.textContent = '[part="loader"] { animation: none !important; opacity: 1 !important; }';
    file.shadowRoot.appendChild(style);
  });
}

/**
 * Wait for the file list to render its children and for the children
 * to complete their Lit update cycle and receive external theme styles.
 */
export async function waitForRendered() {
  await nextRender();
  await nextFrame();
}
