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
import { DatePicker } from '@vaadin/date-picker/src/vaadin-date-picker.js';

/**
 * @deprecated Import `DatePicker` from `@vaadin/date-picker` instead.
 */
export const DatePickerElement = DatePicker;

export * from '@vaadin/date-picker/src/vaadin-date-picker.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-date-picker" is deprecated. Use "@vaadin/date-picker" instead.',
);
