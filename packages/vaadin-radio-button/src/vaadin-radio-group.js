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
import { RadioGroup } from '@vaadin/radio-group/src/vaadin-radio-group.js';

/**
 * @deprecated Import `RadioGroup` from `@vaadin/radio-group` instead.
 */
export const RadioGroupElement = RadioGroup;

export * from '@vaadin/radio-group/src/vaadin-radio-group.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-radio-button" is deprecated. Use "@vaadin/radio-group" instead.',
);
