/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { AppLayout } from '@vaadin/app-layout/src/vaadin-app-layout.js';

/**
 * @deprecated Import `AppLayout` from `@vaadin/app-layout` instead.
 */
export const AppLayoutElement = AppLayout;

export * from '@vaadin/app-layout/src/vaadin-app-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-app-layout" is deprecated. Use "@vaadin/app-layout" instead.',
);
