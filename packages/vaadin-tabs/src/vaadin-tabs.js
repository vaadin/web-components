/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Tabs } from '@vaadin/tabs/src/vaadin-tabs.js';

/**
 * @deprecated Import `Tabs` from `@vaadin/tabs` instead.
 */
export const TabsElement = Tabs;

export * from '@vaadin/tabs/src/vaadin-tabs.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-tabs" is deprecated. Use "@vaadin/tabs" instead.');
