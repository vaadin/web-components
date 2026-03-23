import { nextRender, nextResize } from '@vaadin/testing-helpers';

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
