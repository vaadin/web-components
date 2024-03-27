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
import { EmailField } from '@vaadin/email-field/src/vaadin-email-field.js';

/**
 * @deprecated Import `EmailField` from `@vaadin/email-field` instead.
 */
export const EmailFieldElement = EmailField;

export * from '@vaadin/email-field/src/vaadin-email-field.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/email-field" instead.',
);
