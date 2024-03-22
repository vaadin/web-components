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
import { VerticalLayout } from '@vaadin/vertical-layout/src/vaadin-vertical-layout.js';

/**
 * @deprecated Import `VerticalLayout` from `@vaadin/vertical-layout` instead.
 */
export const VerticalLayoutElement = VerticalLayout;

export * from '@vaadin/vertical-layout/src/vaadin-vertical-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-ordered-layout" is deprecated. Use "@vaadin/vertical-layout" instead.',
);
