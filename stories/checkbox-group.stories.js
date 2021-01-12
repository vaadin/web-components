import { html } from 'lit-html';
import '../packages/vaadin-checkbox/vaadin-checkbox-group.js';

export default {
  title: 'Components/Checkbox Group',
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

const CheckboxGroup = ({
  label,
  helperText,
  errorMessage,
  theme,
  disabled = false,
  required = false,
  invalid = false
}) => {
  return html`
    <vaadin-checkbox-group
      .label="${label}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .disabled="${disabled}"
      .required="${required}"
      .invalid="${invalid}"
      theme="${theme}"
    >
      <vaadin-checkbox value="engineering">Engineering</vaadin-checkbox>
      <vaadin-checkbox value="marketing">Marketing</vaadin-checkbox>
      <vaadin-checkbox value="operations">Operations</vaadin-checkbox>
      <vaadin-checkbox value="sales">Sales</vaadin-checkbox>
    </vaadin-checkbox-group>
  `;
};

export const Basic = (args) => CheckboxGroup(args);

Basic.args = {
  label: 'Departments'
};

export const Validation = (args) => CheckboxGroup(args);

Validation.args = {
  label: 'Departments',
  helperText: 'Choose at least one option',
  required: true,
  errorMessage: 'This field is required'
};
