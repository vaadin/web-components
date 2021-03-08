import { html } from 'lit-html';
import '../packages/vaadin-button/vaadin-button.js';

export default {
  title: 'Components/<vaadin-button>',
  argTypes: {
    disabled: { control: 'boolean' },
    text: { control: 'text' },
    theme: {
      control: {
        type: 'inline-radio',
        options: ['primary', 'secondary', 'tertiary', 'tertiary-inline']
      }
    },
    variant: {
      control: {
        type: 'inline-radio',
        options: ['(not set)', 'error', 'success', 'contrast']
      }
    }
  }
};

const Button = ({ disabled = false, theme, variant, text }) => {
  return html`<vaadin-button ?disabled="${disabled}" theme="${theme} ${variant}">${text}</vaadin-button>`;
};

export const Basic = (args) => Button(args);

Basic.args = {
  theme: 'secondary',
  text: 'Button',
  variant: '(not set)'
};
