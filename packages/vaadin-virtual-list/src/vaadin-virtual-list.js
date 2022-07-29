/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { VirtualList } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';

/**
 * @deprecated Import `VirtualList` from `@vaadin/virtual-list` instead.
 */
export const VirtualListElement = VirtualList;

export * from '@vaadin/virtual-list/src/vaadin-virtual-list.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-virtual-list" is deprecated. Use "@vaadin/virtual-list" instead.',
);
