import { html } from 'lit-html';
import '../packages/vaadin-text-field/vaadin-email-field.js';

export default {
  title: 'Components/<vaadin-email-field>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    minlength: { control: 'number' },
    maxlength: { control: 'number' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    autoselect: { control: 'boolean' },
    clearButtonVisible: { control: 'boolean' }
  }
};

const EmailField = ({
  label,
  helperText,
  errorMessage,
  placeholder,
  maxlength,
  minlength,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  autoselect = false,
  clearButtonVisible = false
}) => {
  return html`
    <vaadin-email-field
      .label="${label}"
      .placeholder="${placeholder}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .maxlength="${maxlength}"
      .minlength="${minlength}"
      .disabled="${disabled}"
      .readonly="${readonly}"
      .required="${required}"
      .invalid="${invalid}"
      .autoselect="${autoselect}"
      .clearButtonVisible="${clearButtonVisible}"
    ></vaadin-email-field>
  `;
};

export const Basic = (args) => EmailField(args);

Basic.args = {
  label: 'Email'
};
