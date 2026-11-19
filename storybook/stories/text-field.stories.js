import '@vaadin/text-field';
import { html } from 'lit';
import { fn } from 'storybook/test';

export default {
  title: 'Fields/Text Field',
  component: 'vaadin-text-field',
  args: {
    label: 'Street address',
    placeholder: '',
    helperText: '',
    errorMessage: '',
    value: '',
    clearButtonVisible: false,
    disabled: false,
    readonly: false,
    required: false,
    onChange: fn(),
  },
  render: (args) => html`
    <vaadin-text-field
      .label=${args.label}
      .placeholder=${args.placeholder}
      .helperText=${args.helperText}
      .errorMessage=${args.errorMessage}
      .value=${args.value}
      ?clear-button-visible=${args.clearButtonVisible}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      @change=${args.onChange}
    ></vaadin-text-field>
  `,
};

export const Default = {};

export const HelperText = {
  args: {
    placeholder: 'Mannerheimintie 1',
    helperText: 'Street name and house number',
    clearButtonVisible: true,
  },
};

export const Required = {
  args: {
    required: true,
    errorMessage: 'Enter a street address',
  },
};

export const ReadOnly = {
  args: {
    value: 'Ruukinkatu 2-4',
    readonly: true,
  },
};
