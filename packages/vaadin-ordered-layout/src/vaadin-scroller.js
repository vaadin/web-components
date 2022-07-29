/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
