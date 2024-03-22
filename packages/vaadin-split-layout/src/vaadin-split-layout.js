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
import { SplitLayout } from '@vaadin/split-layout/src/vaadin-split-layout.js';

/**
 * @deprecated Import `SplitLayout` from `@vaadin/split-layout` instead.
 */
export const SplitLayoutElement = SplitLayout;

export * from '@vaadin/split-layout/src/vaadin-split-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-split-layout" is deprecated. Use "@vaadin/split-layout" instead.',
);
