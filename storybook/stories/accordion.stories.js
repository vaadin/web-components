import '@vaadin/accordion';
import { html } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const PANELS = [
  { summary: 'Personal information', content: 'Name, date of birth and nationality.' },
  { summary: 'Billing address', content: 'Street, postal code and city.' },
  { summary: 'Payment', content: 'Card number, expiry date and security code.' },
];

const meta = preview.meta({
  title: 'Containers/Accordion',
  component: 'vaadin-accordion',
  args: {
    opened: 0,
    theme: '',
    onOpenedChanged: fn(),
  },
  argTypes: {
    opened: { control: { type: 'number', min: 0, max: PANELS.length - 1 }, description: 'Index of the opened panel' },
    theme: { control: 'select', options: ['', 'filled', 'reverse', 'small', 'no-padding'] },
  },
  render: (args) => html`
    <vaadin-accordion .opened=${args.opened} @opened-changed=${args.onOpenedChanged}>
      ${PANELS.map(
        ({ summary, content }) => html`
          <vaadin-accordion-panel .summary=${summary} theme=${args.theme}>
            <div>${content}</div>
          </vaadin-accordion-panel>
        `,
      )}
    </vaadin-accordion>
  `,
});

export const Default = meta.story();

export const AllClosed = meta.story({
  args: { opened: null },
});

export const Filled = meta.story({
  args: { theme: 'filled' },
});
