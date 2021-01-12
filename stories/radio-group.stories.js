import { html } from 'lit-html';
import '../packages/vaadin-radio-button/vaadin-radio-group.js';

export default {
  title: 'Components/Radio Group',
  argTypes: {
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    theme: {
      control: {
        type: 'inline-radio',
        options: ['(not set)', 'vertical']
      }
    }
  }
};

const RadioGroup = ({
  label,
  helperText,
  errorMessage,
  theme,
  disabled = false,
  required = false,
  invalid = false
}) => {
  return html`
    <vaadin-radio-group
      .label="${label}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .disabled="${disabled}"
      .required="${required}"
      .invalid="${invalid}"
      theme="${theme}"
    >
      <vaadin-radio-button value="pending">Pending</vaadin-radio-button>
      <vaadin-radio-button value="submitted">Submitted</vaadin-radio-button>
      <vaadin-radio-button value="confirmed">Confirmed</vaadin-radio-button>
    </vaadin-radio-group>
  `;
};

export const Basic = (args) => RadioGroup(args);

Basic.args = {
  label: 'Status'
};

export const Validation = (args) => RadioGroup(args);

Validation.args = {
  label: 'Status',
  helperText: 'Choose at least one option',
  required: true,
  errorMessage: 'This field is required'
};
