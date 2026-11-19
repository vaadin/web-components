import '@vaadin/switch';
import { html } from 'lit';
import { fn } from 'storybook/test';

export default {
  title: 'Fields/Switch',
  component: 'vaadin-switch',
  args: {
    label: 'Email notifications',
    helperText: '',
    checked: false,
    disabled: false,
    readonly: false,
    onChange: fn(),
  },
  render: (args) => html`
    <vaadin-switch
      .label=${args.label}
      .helperText=${args.helperText}
      .checked=${args.checked}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      @change=${args.onChange}
    ></vaadin-switch>
  `,
};

export const Default = {};

export const Checked = {
  args: { checked: true },
};

export const HelperText = {
  args: { helperText: 'Get an email when someone mentions you' },
};

export const Disabled = {
  args: { checked: true, disabled: true },
};
