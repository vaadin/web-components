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
import { FormLayout } from '@vaadin/form-layout/src/vaadin-form-layout.js';

/**
 * @deprecated Import `FormLayout` from `@vaadin/form-layout` instead.
 */
export const FormLayoutElement = FormLayout;

export * from '@vaadin/form-layout/src/vaadin-form-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-form-layout" is deprecated. Use "@vaadin/form-layout" instead.',
);
