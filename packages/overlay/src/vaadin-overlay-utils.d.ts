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
 * Detect whether an animation runs on the given element, so that its end can be
 * awaited before the element is hidden or removed. An element that is not rendered,
 * has no animation name, or has a zero duration does not fire `animationend`.
 */
export function shouldAnimate(element: HTMLElement): boolean;

/**
 * Collect the animations that report the state of the given element, so that their end can be
 * awaited before the element is hidden or removed. The animations are read instead of the
 * computed style, so that the decision to wait cannot disagree with what the browser actually
 * created: a keyframes rule that does not exist and an element that is not rendered both give
 * an empty list.
 *
 * Only CSS animations count, as the transitions and the script animations that `getAnimations()`
 * also returns do not report the state. Animations of any content are already left out, as
 * `getAnimations()` only descends into the subtree when asked to. Animations that take no time
 * are dropped as well, so that a delay on its own does not hold the state.
 */
export function getStateAnimations(element: HTMLElement): Animation[];

/**
 * Toggle the state attribute on the overlay element and also its owner element. This allows targeting state attributes
 * in the light DOM in case the overlay is in the shadow DOM of its owner.
 */
export function setOverlayStateAttribute(overlay: HTMLElement, name: string, value: string | boolean): void;
