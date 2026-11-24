/**
 * @license
 * Copyright (c) 2022 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { forwardRef } from 'react';
import { TimePicker as _TimePicker, type TimePickerElement, type TimePickerProps } from './generated/TimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWithOrderedProps.js';

export * from './generated/TimePicker.js';

export const TimePicker = forwardRef(
  createComponentWithOrderedProps<TimePickerProps, TimePickerElement>(_TimePicker, 'value'),
);
