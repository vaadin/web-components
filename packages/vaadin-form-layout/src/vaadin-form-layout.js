/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FormLayout } from '@vaadin/form-layout/src/vaadin-form-layout.js';

/**
 * @deprecated Import `FormLayout` from `@vaadin/form-layout` instead.
 */
export const FormLayoutElement = FormLayout;

export * from '@vaadin/form-layout/src/vaadin-form-layout.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-form-layout" is deprecated. Use "@vaadin/form-layout" instead.',
);
