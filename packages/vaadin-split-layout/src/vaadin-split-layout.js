/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
