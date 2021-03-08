import { html } from 'lit-html';
import '../packages/vaadin-text-field/vaadin-password-field.js';

export default {
  title: 'Components/<vaadin-password-field>',
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
    clearButtonVisible: { control: 'boolean' },
    revealButtonHidden: { control: 'boolean' }
  }
};

const PasswordField = ({
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
  clearButtonVisible = false,
  revealButtonHidden = false
}) => {
  return html`
    <vaadin-password-field
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
      .revealButtonHidden="${revealButtonHidden}"
    ></vaadin-password-field>
  `;
};

export const Basic = (args) => PasswordField(args);

Basic.args = {
  label: 'Password'
};
