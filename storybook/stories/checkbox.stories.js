import '@vaadin/checkbox';
import { html } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const meta = preview.meta({
  title: 'Checkbox',
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
});

export const Default = meta.story();

export const Checked = meta.story({
  args: { checked: true },
});

export const Indeterminate = meta.story({
  args: { label: 'Select all', indeterminate: true },
});

export const Disabled = meta.story({
  args: { checked: true, disabled: true },
});
