import { html } from 'lit-html';
import '../packages/vaadin-time-picker/vaadin-time-picker.js';

export default {
  title: 'Form inputs/<vaadin-time-picker>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    step: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    autoOpenDisabled: { control: 'boolean' },
    clearButtonVisible: { control: 'boolean' }
  }
};

const TimePicker = ({
  label,
  helperText,
  min = '00:00',
  max = '23:59',
  step,
  errorMessage,
  placeholder,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  autoOpenDisabled = false,
  clearButtonVisible = false
}) => {
  return html`
    <vaadin-time-picker
      .label="${label}"
      .placeholder="${placeholder}"
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
      .clearButtonVisible="${clearButtonVisible}"
    ></vaadin-time-picker>
  `;
};

export const Basic = (args) => TimePicker(args);

Basic.args = {
  label: 'Meeting time',
  step: 1800
};

export const Validation = (args) => TimePicker(args);

Validation.args = {
  label: 'Appointment time',
  helperText: 'Open 8:00-16:00',
  required: true,
  errorMessage: 'Please choose a valid time',
  min: '08:00',
  max: '16:00',
  step: 1800
};
