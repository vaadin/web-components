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
export const ZOOM_LEVELS: number[];

/** The smallest zoom of the zoom buttons and pinch-to-zoom. */
export const MIN_ZOOM: number;

/** The largest zoom of the zoom buttons and pinch-to-zoom. */
export const MAX_ZOOM: number;

/**
 * Returns the next zoom level above the given zoom factor, if any.
 */
export function getZoomInLevel(zoomFactor: number): number | undefined;

/**
 * Returns the next zoom level below the given zoom factor, if any.
 */
export function getZoomOutLevel(zoomFactor: number): number | undefined;

/**
 * Formats a zoom factor as a percentage in the language of the element, e.g.
 * `1.5` as `150%`. Uses the default language when the `lang` attribute is not
 * a valid language tag, e.g. `en_US`.
 */
export function formatZoom(zoom: number, element: Element): string;

/**
 * Whether the value is a supported `zoom`: `page-width`, `page-fit`, or a
 * finite positive number, also as a string.
 */
export function isValidZoom(zoom: unknown): boolean;
