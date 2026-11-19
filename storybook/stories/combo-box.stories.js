import '@vaadin/combo-box';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { comboBoxRenderer } from '@vaadin/combo-box/lit.js';
import { countries, people } from './data.js';

export default {
  title: 'Fields/Combo Box',
  component: 'vaadin-combo-box',
  args: {
    label: 'Country',
    placeholder: '',
    helperText: '',
    allowCustomValue: false,
    autoOpenDisabled: false,
    clearButtonVisible: false,
    disabled: false,
    readonly: false,
    onChange: fn(),
  },
  render: (args) => html`
    <vaadin-combo-box
      .label=${args.label}
      .placeholder=${args.placeholder}
      .helperText=${args.helperText}
      .items=${countries}
      ?allow-custom-value=${args.allowCustomValue}
      ?auto-open-disabled=${args.autoOpenDisabled}
      ?clear-button-visible=${args.clearButtonVisible}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      @change=${args.onChange}
    ></vaadin-combo-box>
  `,
};

export const Default = {};

export const CustomValue = {
  args: {
    allowCustomValue: true,
    helperText: 'Pick a country or type your own',
  },
};

export const ItemRenderer = {
  args: { label: 'Person' },
  render: ({ label }) => html`
    <vaadin-combo-box
      .label=${label}
      .items=${people}
      item-label-path="email"
      item-value-path="id"
      style="--vaadin-combo-box-overlay-width: 20rem"
      ${comboBoxRenderer(
        (person) => html`
          <div>
            <div>${person.firstName} ${person.lastName}</div>
            <div style="font-size: 0.875em; opacity: 0.7">${person.email}</div>
          </div>
        `,
      )}
    ></vaadin-combo-box>
  `,
};
