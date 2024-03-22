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
import { TimePicker } from '@vaadin/time-picker';

export * from '@vaadin/time-picker/src/vaadin-time-picker.js';

/**
 * @deprecated Import `TimePicker` from `@vaadin/time-picker` instead.
 */
export const TimePickerElement = TimePicker;

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-time-picker" is deprecated. Use "@vaadin/time-picker" instead.',
);
