/**
 * @license
 * Copyright (c) 2024 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Observe moving an element around on a page.
 *
 * Based on the idea from https://samthor.au/2021/observing-dom/ as implemented in Floating UI
 * https://github.com/floating-ui/floating-ui/blob/58ed169/packages/dom/src/autoUpdate.ts#L45
 *
 * @param {HTMLElement} element
 * @param {Function} callback
 * @return {Function}
 */
export function observeMove(element, callback) {
  let io = null;
  let timeout;

  const root = document.documentElement;

  function cleanup() {
    timeout && clearTimeout(timeout);
    io && io.disconnect();
    io = null;
  }

  function refresh(skip = false, threshold = 1) {
    cleanup();

    const { left, top, width, height } = element.getBoundingClientRect();

    if (!skip) {
      callback();
    }

    if (!width || !height) {
      return;
    }

    const insetTop = Math.floor(top);
    const insetRight = Math.floor(root.clientWidth - (left + width));
    const insetBottom = Math.floor(root.clientHeight - (top + height));
    const insetLeft = Math.floor(left);

    const rootMargin = `${-insetTop}px ${-insetRight}px ${-insetBottom}px ${-insetLeft}px`;

    const options = {
      rootMargin,
      threshold: Math.max(0, Math.min(1, threshold)) || 1,
    };

    let isFirstUpdate = true;

    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;

      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }

        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeout = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }

      isFirstUpdate = false;
    }

    io = new IntersectionObserver(handleObserve, options);

    io.observe(element);
  }

  refresh(true);

  return cleanup;
}
