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
import { TextField } from '@vaadin/text-field/src/vaadin-text-field.js';

/**
 * @deprecated Import `TextField` from `@vaadin/text-field` instead.
 */
export const TextFieldElement = TextField;

export * from '@vaadin/text-field/src/vaadin-text-field.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/text-field" instead.',
);
