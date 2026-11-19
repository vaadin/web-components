import '@vaadin/checkbox';
import { html } from 'lit';
import { fn } from 'storybook/test';

export default {
  title: 'Fields/Checkbox',
  component: 'vaadin-checkbox',
  args: {
    label: 'I accept the terms and conditions',
    helperText: '',
    checked: false,
    indeterminate: false,
    disabled: false,
    readonly: false,
    onChange: fn(),
  },
  render: (args) => html`
    <vaadin-checkbox
      .label=${args.label}
      .helperText=${args.helperText}
      .checked=${args.checked}
      .indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      @change=${args.onChange}
    ></vaadin-checkbox>
  `,
};

export const Default = {};

export const Checked = {
  args: { checked: true },
};

export const Indeterminate = {
  args: { label: 'Select all', indeterminate: true },
};

export const Disabled = {
  args: { checked: true, disabled: true },
};
