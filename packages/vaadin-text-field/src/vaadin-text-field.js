/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
