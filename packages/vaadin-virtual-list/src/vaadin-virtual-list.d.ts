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
import type { VirtualList, VirtualListDefaultItem } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';

/**
 * @deprecated Import `VirtualList` from `@vaadin/virtual-list` instead.
 */
export type VirtualListElement<TItem = VirtualListDefaultItem> = VirtualList<TItem>;

/**
 * @deprecated Import `VirtualList` from `@vaadin/virtual-list` instead.
 */
export const VirtualListElement: typeof VirtualList;

export * from '@vaadin/virtual-list/src/vaadin-virtual-list.js';
