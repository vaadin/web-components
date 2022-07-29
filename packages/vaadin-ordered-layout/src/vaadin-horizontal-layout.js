/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
