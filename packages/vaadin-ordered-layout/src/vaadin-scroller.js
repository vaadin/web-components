/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Scroller } from '@vaadin/scroller/src/vaadin-scroller.js';

/**
 * @deprecated Import `Scroller` from `@vaadin/scroller` instead.
 */
export const ScrollerElement = Scroller;

export * from '@vaadin/scroller/src/vaadin-scroller.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-ordered-layout" is deprecated. Use "@vaadin/scroller" instead.',
);
