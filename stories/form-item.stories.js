import { html } from 'lit-html';
import '../packages/vaadin-form-layout/vaadin-form-item.js';
import '../packages/vaadin-text-field/vaadin-text-field.js';

export default {
  title: 'Layouts/<vaadin-form-item>',
  argTypes: {
    label: { control: 'text' },
    labelPosition: {
      control: {
        type: 'inline-radio',
        options: ['(not set)', 'top']
      }
    }
  }
};

const FormItem = ({ label, labelPosition }) => {
  return html`
    <vaadin-form-item label-position="${labelPosition}">
      <label slot="label">${label}</label>
      <vaadin-text-field></vaadin-text-field>
    </vaadin-form-item>
  `;
};

export const Basic = (args) => FormItem(args);

Basic.args = {
  label: 'First name',
  labelPosition: '(not set)'
};
