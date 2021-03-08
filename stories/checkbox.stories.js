import { html } from 'lit-html';
import '../packages/vaadin-checkbox/vaadin-checkbox.js';

export default {
  title: 'Components/<vaadin-checkbox>',
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    text: { control: 'text' }
  }
};

const Checkbox = ({ text, checked = false, disabled = false, indeterminate = false }) => {
  return html`
    <vaadin-checkbox .checked="${checked}" .indeterminate="${indeterminate}" .disabled="${disabled}">
      ${text}
    </vaadin-checkbox>
  `;
};

export const Basic = (args) => Checkbox(args);

Basic.args = {
  text: 'I accept the terms and conditions'
};
