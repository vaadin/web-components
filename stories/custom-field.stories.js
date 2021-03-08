import { html, render } from 'lit-html';
import { guard } from 'lit-html/directives/guard';
import '../packages/vaadin-custom-field/vaadin-custom-field.js';
import '../packages/vaadin-text-field/vaadin-text-field.js';
import '../packages/vaadin-select/vaadin-select.js';
import '../packages/vaadin-list-box/vaadin-list-box.js';
import '../packages/vaadin-item/vaadin-item.js';

export default {
  title: 'Components/<vaadin-custom-field>',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' }
  }
};

const CustomField = ({ label, helperText, errorMessage, required = false, invalid = false }) => {
  return html`
    <vaadin-custom-field
      .label="${label}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .required="${required}"
      .invalid="${invalid}"
    >
      <vaadin-select
        style="width: 6em;"
        value="+358"
        .renderer=${guard([], () => (root) =>
          render(
            html`
              <vaadin-list-box>
                <vaadin-item>+358</vaadin-item>
                <vaadin-item>+46</vaadin-item>
                <vaadin-item>+34</vaadin-item>
              </vaadin-list-box>
            `,
            root
          )
        )}
      ></vaadin-select>
      <vaadin-text-field
        prevent-invalid-input
        pattern="[0-9]*"
        maxlength="4"
        placeholder="Area"
        style="width: 5em;"
      ></vaadin-text-field>
      <vaadin-text-field
        prevent-invalid-input
        pattern="[0-9]*"
        maxlength="8"
        placeholder="Subscriber"
      ></vaadin-text-field>
    </vaadin-custom-field>
  `;
};

export const Basic = (args) => CustomField(args);

Basic.args = {
  label: 'Phone number'
};

export const Validation = (args) => CustomField(args);

Validation.args = {
  label: 'Phone number',
  required: true,
  errorMessage: 'Please choose a valid phone number'
};
