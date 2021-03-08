import { html, render } from 'lit-html';
import { guard } from 'lit-html/directives/guard';
import '../packages/vaadin-select/vaadin-select.js';
import '../packages/vaadin-list-box/vaadin-list-box.js';
import '../packages/vaadin-item/vaadin-item.js';

export default {
  title: 'Form inputs/<vaadin-select>',
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' }
  }
};

const Select = ({
  label,
  helperText,
  errorMessage,
  placeholder,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false
}) => {
  return html`
    <vaadin-select
      .label="${label}"
      .placeholder="${placeholder}"
      .helperText="${helperText}"
      .errorMessage="${errorMessage}"
      .disabled="${disabled}"
      .readonly="${readonly}"
      .required="${required}"
      .invalid="${invalid}"
      .renderer=${guard([], () => (root) =>
        render(
          html`
            <vaadin-list-box>
              <vaadin-item value="recent">Most recent first</vaadin-item>
              <vaadin-item value="rating-desc">Rating: high to low</vaadin-item>
              <vaadin-item value="rating-asc">Rating: low to high</vaadin-item>
              <vaadin-item value="price-desc">Price: high to low</vaadin-item>
              <vaadin-item value="price-asc">Price: low to high</vaadin-item>
            </vaadin-list-box>
          `,
          root
        )
      )}
    ></vaadin-select>
  `;
};

export const Basic = (args) => Select(args);

Basic.args = {
  label: 'Sort by'
};

export const Validation = (args) => Select(args);

Validation.args = {
  label: 'Sort by',
  required: true,
  errorMessage: 'Please choose a direction'
};
