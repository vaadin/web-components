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
import { CheckboxGroup } from '@vaadin/checkbox-group/src/vaadin-checkbox-group.js';

/**
 * @deprecated Import `CheckboxGroup` from `@vaadin/checkbox-group` instead.
 */
export const CheckboxGroupElement = CheckboxGroup;

export * from '@vaadin/checkbox-group/src/vaadin-checkbox-group.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-checkbox" is deprecated. Use "@vaadin/checkbox-group" instead.',
);
