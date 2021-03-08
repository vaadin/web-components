import { html } from 'lit-html';
import '../packages/vaadin-text-field/vaadin-integer-field.js';

export default {
  title: 'Components/<vaadin-integer-field>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    autoselect: { control: 'boolean' },
    clearButtonVisible: { control: 'boolean' },
    hasControls: { control: 'boolean' }
  }
};

const IntegerField = ({
  label,
  helperText,
  errorMessage,
  placeholder,
  min,
  max,
  step,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  autoselect = false,
  clearButtonVisible = false,
  hasControls = false
}) => {
  return html`
    <vaadin-integer-field
      .label="${label}"
      .placeholder="${placeholder}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .disabled="${disabled}"
      .readonly="${readonly}"
      .required="${required}"
      .invalid="${invalid}"
      .autoselect="${autoselect}"
      .min="${min}"
      .max="${max}"
      .step="${step}"
      .clearButtonVisible="${clearButtonVisible}"
      .hasControls="${hasControls}"
    ></vaadin-integer-field>
  `;
};

export const Basic = (args) => IntegerField(args);

Basic.args = {
  label: 'Balance'
};

export const Validation = (args) => IntegerField(args);

Validation.args = {
  label: 'Quantity',
  helperText: 'Max 10 items',
  required: true,
  errorMessage: 'This field is required',
  min: 0,
  max: 10,
  hasControls: true
};
