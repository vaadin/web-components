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
import { AppLayout } from '@vaadin/app-layout/src/vaadin-app-layout.js';

/**
 * @deprecated Import `AppLayout` from `@vaadin/app-layout` instead.
 */
export const AppLayoutElement = AppLayout;

export * from '@vaadin/app-layout/src/vaadin-app-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-app-layout" is deprecated. Use "@vaadin/app-layout" instead.',
);
