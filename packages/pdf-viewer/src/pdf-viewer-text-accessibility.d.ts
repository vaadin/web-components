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
 * The prefix of the ids of annotation elements, as in pdf.js.
 */
export declare const ANNOTATION_ID_PREFIX: string;

/**
 * Compares the positions of two annotations in PDF units, to order links by
 * line from the top, then from the left.
 */
export declare function compareAnnotationPositions(a: { rect: number[] }, b: { rect: number[] }): number;

/**
 * Adds each link to the `aria-owns` of the nearest text element before it,
 * so that assistive technology reads the links in the flow of the text.
 */
export declare function addLinksToText(textDivs: HTMLElement[], links: HTMLElement[]): void;
