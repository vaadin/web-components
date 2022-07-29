/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
