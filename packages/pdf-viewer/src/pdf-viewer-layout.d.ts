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

export type PdfViewerVisiblePage = {
  /** The index of the page. */
  index: number;
  /** The height of the page that is inside the view. */
  height: number;
};

export type PdfViewerPageBox = {
  /** The top of the page in the scrollable content. */
  top: number;
  /** The height of the page. */
  height: number;
  /** The left edge of the page in the viewport. */
  left: number;
  /** The width of the page. */
  width: number;
};

/**
 * Returns the scale that fits a page width to the available size, or 0
 * when there is no space.
 */
export declare function getFitScale(availableSize: { width: number; height: number }, pageWidth: number): number;

/**
 * Returns the pages that intersect the view, in document order. When no page
 * intersects it, returns the first page below the top of the view with a
 * visible height of 0.
 */
export declare function getVisiblePages(
  count: number,
  getBounds: (index: number) => { top: number; height: number },
  viewTop: number,
  viewBottom: number,
): PdfViewerVisiblePage[];

/**
 * Returns the index of the page that takes up most of the view. The first
 * one wins a tie.
 */
export declare function getMostVisibleIndex(visible: PdfViewerVisiblePage[]): number;

/**
 * Returns where the middle of the top of the view is on a page, relative to
 * the size of the page.
 */
export declare function getAnchor(
  view: { center: number; scrollTop: number },
  page: PdfViewerPageBox,
): { x: number; y: number };

/**
 * Returns the vertical scroll position that puts the anchor point of a page
 * at the top of the view.
 */
export declare function getAnchorScrollTop(anchor: { y: number }, page: { top: number; height: number }): number;

/**
 * Returns how far to scroll horizontally to put the anchor point of a page
 * in the middle of the view. A page that fits the width of the view is
 * centered instead.
 */
export declare function getAnchorScrollLeftDelta(
  anchor: { x: number },
  view: { center: number; width: number },
  page: { left: number; width: number },
): number;
