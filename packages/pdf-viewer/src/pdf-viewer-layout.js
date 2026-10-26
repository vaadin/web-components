/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/**
 * @typedef {Object} PdfViewerVisiblePage
 * @property {number} index The index of the page.
 * @property {number} height The height of the page that is inside the view.
 */

/**
 * @typedef {Object} PdfViewerPageBox
 * @property {number} top The top of the page in the scrollable content.
 * @property {number} height The height of the page.
 * @property {number} left The left edge of the page in the viewport.
 * @property {number} width The width of the page.
 */

/**
 * Returns the scale that fits a page width to the available size, or 0
 * when there is no space.
 *
 * @param {{ width: number, height: number }} availableSize
 * @param {number} pageWidth the width of the page at scale 1
 * @return {number}
 */
export function getFitScale({ width, height }, pageWidth) {
  return width > 0 && height > 0 ? width / pageWidth : 0;
}

/**
 * Returns the pages that intersect the view, in document order. When no page
 * intersects it, returns the first page below the top of the view with a
 * visible height of 0.
 *
 * @param {number} count the number of pages
 * @param {(index: number) => { top: number, height: number }} getBounds
 *   returns the position of a page in the scrollable content
 * @param {number} viewTop
 * @param {number} viewBottom
 * @return {PdfViewerVisiblePage[]}
 */
export function getVisiblePages(count, getBounds, viewTop, viewBottom) {
  // Binary search for the first page that ends below the top of the view.
  let low = 0;
  let high = count - 1;
  while (low < high) {
    const middle = (low + high) >> 1;
    const { top, height } = getBounds(middle);
    if (top + height <= viewTop) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  const visible = [];
  for (let index = low; index < count; index++) {
    const { top, height } = getBounds(index);
    if (top >= viewBottom) {
      break;
    }
    visible.push({ index, height: Math.min(viewBottom, top + height) - Math.max(viewTop, top) });
  }
  if (!visible.length) {
    visible.push({ index: low, height: 0 });
  }
  return visible;
}

/**
 * Returns the index of the page that takes up most of the view. The first
 * one wins a tie.
 *
 * @param {PdfViewerVisiblePage[]} visible
 * @return {number}
 */
export function getMostVisibleIndex(visible) {
  return visible.reduce((result, item) => (item.height > result.height ? item : result)).index;
}

/**
 * Returns where the middle of the top of the view is on a page, relative to
 * the size of the page.
 *
 * @param {{ center: number, scrollTop: number }} view
 * @param {PdfViewerPageBox} page
 * @return {{ x: number, y: number }}
 */
export function getAnchor(view, page) {
  return {
    x: (view.center - page.left) / page.width,
    y: (view.scrollTop - page.top) / page.height,
  };
}

/**
 * Returns the vertical scroll position that puts the anchor point of a page
 * at the top of the view.
 *
 * @param {{ y: number }} anchor
 * @param {{ top: number, height: number }} page
 * @return {number}
 */
export function getAnchorScrollTop(anchor, page) {
  return page.top + anchor.y * page.height;
}

/**
 * Returns how far to scroll horizontally to put the anchor point of a page
 * in the middle of the view. A page that fits the width of the view is
 * centered instead. Works with viewport positions, so that the result is
 * the same for any scroll direction.
 *
 * @param {{ x: number }} anchor
 * @param {{ center: number, width: number }} view
 * @param {{ left: number, width: number }} page
 * @return {number}
 */
export function getAnchorScrollLeftDelta(anchor, view, page) {
  const ratio = page.width <= view.width ? 0.5 : anchor.x;
  return page.left + ratio * page.width - view.center;
}
