/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
