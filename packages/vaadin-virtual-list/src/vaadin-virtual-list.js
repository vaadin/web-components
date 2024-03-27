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
import { VirtualList } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';

/**
 * @deprecated Import `VirtualList` from `@vaadin/virtual-list` instead.
 */
export const VirtualListElement = VirtualList;

export * from '@vaadin/virtual-list/src/vaadin-virtual-list.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-virtual-list" is deprecated. Use "@vaadin/virtual-list" instead.',
);
