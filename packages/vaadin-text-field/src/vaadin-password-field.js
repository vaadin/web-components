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
import { PasswordField } from '@vaadin/password-field/src/vaadin-password-field.js';

/**
 * @deprecated Import `PasswordField` from `@vaadin/password-field` instead.
 */
export const PasswordFieldElement = PasswordField;

export * from '@vaadin/password-field/src/vaadin-password-field.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-text-field" is deprecated. Use "@vaadin/password-field" instead.',
);
