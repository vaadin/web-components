/**
 * @license
 * Copyright (c) 2024 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Observe moving an element around on a page.
 *
 * Based on the idea from https://samthor.au/2021/observing-dom/ as implemented in Floating UI
 * https://github.com/floating-ui/floating-ui/blob/58ed169/packages/dom/src/autoUpdate.ts#L45
 */
export function observeMove(element: HTMLElement, callback: () => void): () => void;

/**
 * Detect whether an animation runs on the given element. Prefer `getStateAnimations()`.
 */
export function shouldAnimate(element: HTMLElement): boolean;

/**
 * The animations that report the state of the given element, so that their end can be awaited
 * before the element is hidden or removed. Only CSS animations of the element itself that take
 * time are included: a keyframes rule that does not exist and an element that is not rendered
 * both give an empty list.
 */
export function getStateAnimations(element: HTMLElement): Animation[];

/**
 * Toggle the state attribute on the overlay element and also its owner element. This allows targeting state attributes
 * in the light DOM in case the overlay is in the shadow DOM of its owner.
 */
export function setOverlayStateAttribute(overlay: HTMLElement, name: string, value: string | boolean): void;
