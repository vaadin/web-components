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
import { DateTimePicker } from '@vaadin/date-time-picker/src/vaadin-date-time-picker.js';

/**
 * @deprecated Import `DateTimePicker` from `@vaadin/date-time-picker` instead.
 */
export const DateTimePickerElement = DateTimePicker;

export * from '@vaadin/date-time-picker/src/vaadin-date-time-picker.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-date-time-picker" is deprecated. Use "@vaadin/date-time-picker" instead.',
);
