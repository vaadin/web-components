import '@vaadin/switch';
import { html } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const meta = preview.meta({
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
});

export const Default = meta.story();

export const Checked = meta.story({
  args: { checked: true },
});

export const HelperText = meta.story({
  args: { helperText: 'Get an email when someone mentions you' },
});

export const Disabled = meta.story({
  args: { checked: true, disabled: true },
});
