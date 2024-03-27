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
import { Tabs } from '@vaadin/tabs/src/vaadin-tabs.js';

/**
 * @deprecated Import `Tabs` from `@vaadin/tabs` instead.
 */
export const TabsElement = Tabs;

export * from '@vaadin/tabs/src/vaadin-tabs.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-tabs" is deprecated. Use "@vaadin/tabs" instead.');
