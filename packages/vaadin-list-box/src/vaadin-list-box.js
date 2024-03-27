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
import { ListBox } from '@vaadin/list-box/src/vaadin-list-box.js';

/**
 * @deprecated Import `ListBox` from `@vaadin/list-box` instead.
 */
export const ListBoxElement = ListBox;

export * from '@vaadin/list-box/src/vaadin-list-box.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-list-box" is deprecated. Use "@vaadin/list-box" instead.');
