import '@vaadin/button';
import { html, nothing } from 'lit';
import { fn } from 'storybook/test';

const VARIANTS = [
  'primary',
  'tertiary',
  'tertiary-inline',
  'error',
  'success',
  'warning',
  'contrast',
  'small',
  'large',
];

export default {
  title: 'Actions/Button',
  component: 'vaadin-button',
  args: {
    text: 'Button',
    theme: '',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    text: { control: 'text', description: 'Content of the default slot' },
    theme: { control: 'select', options: ['', ...VARIANTS] },
  },
  render: ({ text, theme, disabled, onClick }) => html`
    <vaadin-button theme=${theme || nothing} ?disabled=${disabled} @click=${onClick}>${text}</vaadin-button>
  `,
};

export const Default = {};

export const Primary = {
  args: { theme: 'primary' },
};

export const Disabled = {
  args: { disabled: true },
};

export const Variants = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center">
      ${VARIANTS.map((variant) => html`<vaadin-button theme=${variant}>${variant}</vaadin-button>`)}
    </div>
  `,
};
