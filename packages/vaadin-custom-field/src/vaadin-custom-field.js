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
import { CustomField } from '@vaadin/custom-field/src/vaadin-custom-field.js';

/**
 * @deprecated Import `CustomField` from `@vaadin/custom-field` instead.
 */
export const CustomFieldElement = CustomField;

export * from '@vaadin/custom-field/src/vaadin-custom-field.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-custom-field" is deprecated. Use "@vaadin/custom-field" instead.',
);
