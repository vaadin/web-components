import { nextResize } from '../../grid/test/helpers.js';

/**
 * Resolves once the ResizeObserver in all the BoardRows has processed a resize.
 */
export function allResized(boardRows) {
  return Promise.all(boardRows.map((boardRow) => nextResize(boardRow)));
}
