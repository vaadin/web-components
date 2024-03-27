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
import { IntegerField } from '@vaadin/integer-field/src/vaadin-integer-field.js';

/**
 * @deprecated Import `IntegerField` from `@vaadin/integer-field` instead.
 */
export const IntegerFieldElement = IntegerField;

export * from '@vaadin/integer-field/src/vaadin-integer-field.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/integer-field" instead.',
);
