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
import { HorizontalLayout } from '@vaadin/horizontal-layout/src/vaadin-horizontal-layout.js';

/**
 * @deprecated Import `HorizontalLayout` from `@vaadin/horizontal-layout` instead.
 */
export const HorizontalLayoutElement = HorizontalLayout;

export * from '@vaadin/horizontal-layout/src/vaadin-horizontal-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-ordered-layout" is deprecated. Use "@vaadin/horizontal-layout" instead.',
);
