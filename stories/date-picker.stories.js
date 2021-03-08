import { html } from 'lit-html';
import '../packages/vaadin-date-picker/vaadin-date-picker.js';

export default {
  title: 'Components/<vaadin-date-picker>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
    initialPosition: { control: 'text' },
    autoOpenDisabled: { control: 'boolean' },
    clearButtonVisible: { control: 'boolean' }
  }
};

const DatePicker = ({
  label,
  helperText,
  errorMessage,
  placeholder,
  min,
  max,
  initialPosition,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  autoOpenDisabled = false,
  clearButtonVisible = false
}) => {
  return html`
    <vaadin-date-picker
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
      .initialPosition="${initialPosition}"
      .autoOpenDisabled="${autoOpenDisabled}"
      .clearButtonVisible="${clearButtonVisible}"
    ></vaadin-date-picker>
  `;
};

export const Basic = (args) => DatePicker(args);

Basic.args = {
  label: 'Date'
};

export const Validation = (args) => DatePicker(args);

Validation.args = {
  label: 'Date',
  required: true,
  errorMessage: 'Please choose a valid date'
};
