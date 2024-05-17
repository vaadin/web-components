/**
 * @license
 * Copyright (c) 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Observe moving an element around on a page.
 *
 * Based on the idea from https://samthor.au/2021/observing-dom/ as implemented in Floating UI
 * https://github.com/floating-ui/floating-ui/blob/58ed169/packages/dom/src/autoUpdate.ts#L45
 */
export function observeMove(element: HTMLElement, callback: () => void): () => void;
