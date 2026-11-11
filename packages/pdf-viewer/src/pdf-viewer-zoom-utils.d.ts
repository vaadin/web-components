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

export const PDF_TO_CSS_UNITS: number;

export const ZOOM_LEVELS: number[];

export function getZoomInLevel(zoomFactor: number): number | undefined;

export function getZoomOutLevel(zoomFactor: number): number | undefined;

export function formatZoom(zoom: number): string;

export function isValidZoom(zoom: unknown): boolean;
