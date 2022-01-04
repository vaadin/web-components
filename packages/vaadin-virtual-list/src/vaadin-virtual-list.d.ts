/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { VirtualList, VirtualListDefaultItem } from '@vaadin/virtual-list/src/vaadin-virtual-list.js';

/**
 * @deprecated Import `VirtualList` from `@vaadin/virtual-list` instead.
 */
export type VirtualListElement<TItem = VirtualListDefaultItem> = VirtualList<TItem>;

/**
 * @deprecated Import `VirtualList` from `@vaadin/virtual-list` instead.
 */
export const VirtualListElement: typeof VirtualList;

export * from '@vaadin/virtual-list/src/vaadin-virtual-list.js';
