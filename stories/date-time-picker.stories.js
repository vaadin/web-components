import { html } from 'lit-html';
import '../packages/vaadin-date-time-picker/vaadin-date-time-picker.js';

export default {
  title: 'Components/Date Time Picker',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    datePlaceholder: { control: 'text' },
    timePlaceholder: { control: 'text' },
    helperText: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    step: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    autoOpenDisabled: { control: 'boolean' }
  }
};

const DateTimePicker = ({
  label,
  helperText,
  min,
  max,
  step,
  errorMessage,
  datePlaceholder,
  timePlaceholder,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  autoOpenDisabled = false
}) => {
  return html`
    <vaadin-date-time-picker
      .label="${label}"
      .datePlaceholder="${datePlaceholder}"
      .timePlaceholder="${timePlaceholder}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .disabled="${disabled}"
      .readonly="${readonly}"
      .required="${required}"
      .invalid="${invalid}"
      .min="${min}"
      .max="${max}"
      .step="${step}"
      .autoOpenDisabled="${autoOpenDisabled}"
    ></vaadin-date-time-picker>
  `;
};

export const Basic = (args) => DateTimePicker(args);

Basic.args = {
  label: 'Appointment date and time',
  step: 1800
};

export const Validation = (args) => DateTimePicker(args);

const date = new Date();
date.setMilliseconds(0);
date.setSeconds(0);
date.setMinutes(0);
const min = date.toISOString().slice(0, -1);

date.setDate(date.getDate() + 60);
const max = date.toISOString().slice(0, -1);

Validation.args = {
  label: 'Appointment date and time',
  helperText: 'Must be within 60 days from today',
  required: true,
  errorMessage: 'Please choose a valid time',
  min,
  max,
  step: 1800
};
