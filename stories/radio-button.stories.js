import { html } from 'lit-html';
import '../packages/vaadin-radio-button/vaadin-radio-button.js';

export default {
  title: 'Form inputs/<vaadin-radio-button>',
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    text: { control: 'text' }
  }
};

const RadioButton = ({ text, checked = false, disabled = false }) => {
  return html`<vaadin-radio-button .checked="${checked}" .disabled="${disabled}">${text}</vaadin-radio-button>`;
};

export const Basic = (args) => RadioButton(args);

Basic.args = {
  text: 'Single radio'
};
