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
import { Item } from '@vaadin/item/src/vaadin-item.js';

/**
 * @deprecated Import `Item` from `@vaadin/item` instead.
 */
export const ItemElement = Item;

export * from '@vaadin/item/src/vaadin-item.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-item" is deprecated. Use "@vaadin/item" instead.');
