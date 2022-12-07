import { forwardRef } from 'react';
import {
  DateTimePicker as _DateTimePicker,
  DateTimePickerProps,
  WebComponentModule,
} from './generated/DateTimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWIthOrderedProps.js';

export * from './generated/DateTimePicker.js';

export const DateTimePicker = forwardRef(
  createComponentWithOrderedProps<DateTimePickerProps, WebComponentModule.DateTimePicker>(_DateTimePicker, 'value'),
);
