import '@vaadin/details';
import { html } from 'lit';
import { fn } from 'storybook/test';

export default {
  title: 'Containers/Details',
  component: 'vaadin-details',
  args: {
    summary: 'Contact information',
    opened: false,
    disabled: false,
    theme: '',
    onOpenedChanged: fn(),
  },
  argTypes: {
    theme: { control: 'select', options: ['', 'filled', 'reverse', 'small', 'no-padding'] },
  },
  render: (args) => html`
    <vaadin-details
      .summary=${args.summary}
      .opened=${args.opened}
      ?disabled=${args.disabled}
      theme=${args.theme}
      @opened-changed=${args.onOpenedChanged}
    >
      <div>Mannerheimintie 1</div>
      <div>00100 Helsinki</div>
      <div>Finland</div>
    </vaadin-details>
  `,
};

export const Default = {};

export const Opened = {
  args: { opened: true },
};

export const Filled = {
  args: { opened: true, theme: 'filled' },
};
