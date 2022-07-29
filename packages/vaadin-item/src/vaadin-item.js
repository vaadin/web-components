/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Item } from '@vaadin/item/src/vaadin-item.js';

/**
 * @deprecated Import `Item` from `@vaadin/item` instead.
 */
export const ItemElement = Item;

export * from '@vaadin/item/src/vaadin-item.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-item" is deprecated. Use "@vaadin/item" instead.');
