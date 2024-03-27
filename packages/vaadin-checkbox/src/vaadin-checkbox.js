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
import { Checkbox } from '@vaadin/checkbox/src/vaadin-checkbox.js';

/**
 * @deprecated Import `Checkbox` from `@vaadin/checkbox` instead.
 */
export const CheckboxElement = Checkbox;

export * from '@vaadin/checkbox/src/vaadin-checkbox.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-checkbox" is deprecated. Use "@vaadin/checkbox" instead.');
