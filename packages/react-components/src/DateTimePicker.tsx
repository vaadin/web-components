/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { forwardRef } from 'react';
import {
  DateTimePicker as _DateTimePicker,
  type DateTimePickerElement,
  type DateTimePickerProps,
} from './generated/DateTimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/DateTimePicker.js';

export const DateTimePicker = forwardRef(
  createComponentWithOrderedProps<DateTimePickerProps, DateTimePickerElement>(_DateTimePicker, 'value'),
);
