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
  index: number;
  height: number;
  ratio: number;
};

export type PdfViewerPageBox = {
  top: number;
  height: number;
  left: number;
  width: number;
};

export declare function getFitScale(availableWidth: number, pageWidth: number): number;

export declare function getVisiblePages(
  count: number,
  getBounds: (index: number) => { top: number; height: number },
  viewTop: number,
  viewBottom: number,
): PdfViewerVisiblePage[];

export declare function getMostVisibleIndex(visible: PdfViewerVisiblePage[]): number;

export declare function getAnchor(
  view: { center: number; scrollTop: number },
  page: PdfViewerPageBox,
): { x: number; y: number };

export declare function getAnchorScrollTop(anchor: { y: number }, page: { top: number; height: number }): number;

export declare function getAnchorScrollLeftDelta(
  anchor: { x: number },
  view: { center: number; width: number },
  page: { left: number; width: number },
): number;
