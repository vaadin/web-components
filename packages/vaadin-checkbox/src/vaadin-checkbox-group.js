/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
