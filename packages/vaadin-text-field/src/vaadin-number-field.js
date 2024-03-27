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
import { NumberField } from '@vaadin/number-field/src/vaadin-number-field.js';

/**
 * @deprecated Import `NumberField` from `@vaadin/number-field` instead.
 */
export const NumberFieldElement = NumberField;

export * from '@vaadin/number-field/src/vaadin-number-field.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/number-field" instead.',
);
