/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
