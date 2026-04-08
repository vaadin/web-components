import { nextRender, nextResize } from '@vaadin/testing-helpers';
import { getCurrentAnimation } from '../src/vaadin-master-detail-layout-helpers.js';

/**
 * Waits for a ResizeObserver cycle and the subsequent rAF write phase
 * in `__onResize()` to complete. Use after any change that should trigger
 * overflow recalculation (host resize, property change, DOM change).
 */
export async function onceResized(layout) {
  await nextResize(layout);
  await nextRender();
}

/**
 * Returns a promise that resolves after the given number of animation
 * frames. Useful for letting Web Animations progress between assertions.
 *
 * @param {number} [n=1] - Number of animation frames to wait
 */
export function nextFrames(n = 1) {
  return new Promise((resolve) => {
    let remaining = n;
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Waits until the element has a running animation that has progressed
 * past the initial keyframe. Polls per-frame until the animation exists
 * and its computed translate is strictly between the two endpoints.
 *
 * @param {HTMLElement} element
 * @param {number} offset - The full offscreen translate value in pixels
 * @param {number} [timeout=2000] - Timeout in milliseconds
 */
export async function waitForAnimationProgress(element, offset, timeout = 2000) {
  const start = performance.now();
  while (performance.now() - start < timeout) {
    await nextFrames(1);
    if (getCurrentAnimation(element)) {
      const translate = parseFloat(getComputedStyle(element).translate);
      if (!isNaN(translate) && translate > 0 && translate < offset) {
        return;
      }
    }
  }
  throw new Error('Animation did not reach mid-flight within timeout');
}
