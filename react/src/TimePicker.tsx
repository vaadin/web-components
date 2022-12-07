import { ForwardedRef, forwardRef } from 'react';
import { TimePicker as _TimePicker, TimePickerProps, WebComponentModule } from './generated/TimePicker.js';
import createComponentWithOrderedProps from './utils/createComponentWIthOrderedProps.js';

export * from './generated/TimePicker.js';

export const TimePicker = forwardRef(
  createComponentWithOrderedProps<TimePickerProps, WebComponentModule.TimePicker>(_TimePicker, 'value'),
);
