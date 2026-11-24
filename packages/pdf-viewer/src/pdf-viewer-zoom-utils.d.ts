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

/** CSS pixels per PDF unit at 100%: a PDF unit is 1/72 inch, a CSS pixel 1/96 inch. */
export const PDF_TO_CSS_UNITS: number;

/** The zoom levels of the zoom select, the zoom buttons and the zoom shortcuts. */
export const ZOOM_LEVELS: number[];

/**
 * Returns the next zoom level above the given zoom factor, if any.
 */
export function getZoomInLevel(zoomFactor: number): number | undefined;

/**
 * Returns the next zoom level below the given zoom factor, if any.
 */
export function getZoomOutLevel(zoomFactor: number): number | undefined;

/**
 * Formats a zoom factor as a percentage, e.g. `1.5` as `150%`.
 */
export function formatZoom(zoom: number): string;

/**
 * Whether the value is a supported `zoom`: `page-width`, `page-fit`, or a
 * finite positive number, also as a string.
 */
export function isValidZoom(zoom: unknown): boolean;
