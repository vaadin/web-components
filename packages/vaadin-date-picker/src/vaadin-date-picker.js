/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
