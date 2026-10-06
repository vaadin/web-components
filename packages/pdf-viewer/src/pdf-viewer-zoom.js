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

/** The zoom levels of the zoom select, the zoom buttons and the zoom shortcuts. */
export const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

/** Tolerance for comparing zoom factors, which come from computed scales. */
const ZOOM_EPSILON = 0.001;

/**
 * Returns the next zoom level above the given zoom factor, if any.
 * @param {number} zoomFactor
 * @return {number | undefined}
 */
export function getZoomInLevel(zoomFactor) {
  return zoomFactor > 0 ? ZOOM_LEVELS.find((level) => level > zoomFactor + ZOOM_EPSILON) : undefined;
}

/**
 * Returns the next zoom level below the given zoom factor, if any.
 * @param {number} zoomFactor
 * @return {number | undefined}
 */
export function getZoomOutLevel(zoomFactor) {
  return zoomFactor > 0 ? ZOOM_LEVELS.findLast((level) => level < zoomFactor - ZOOM_EPSILON) : undefined;
}

/**
 * Formats a zoom factor as a percentage in the language of the element, e.g.
 * `1.5` as `150%`.
 * @param {number} zoom
 * @param {Element} element
 * @return {string}
 */
export function formatZoom(zoom, element) {
  const locale = element.closest('[lang]')?.lang || undefined;
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(zoom);
}
