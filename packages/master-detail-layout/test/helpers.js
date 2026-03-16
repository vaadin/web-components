import { nextRender, nextResize } from '@vaadin/testing-helpers';

/**
 * Waits for a ResizeObserver cycle and the subsequent rAF-debounced
 * `__onResize()` to complete. Use after any change that should trigger
 * overflow recalculation (host resize, property change, DOM change).
 */
export async function onceResized(layout) {
  await nextResize(layout);
  await nextRender();
}
