import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import { html, nothing } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const VARIANTS = ['primary', 'tertiary'];

const meta = preview.meta({
  title: 'Button',
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
});

export const Default = meta.story();

export const Primary = meta.story({
  args: { theme: 'primary' },
});

export const Tertiary = meta.story({
  args: { theme: 'tertiary' },
});

export const Icon = meta.story({
  args: { theme: 'icon' },
  render: ({ theme, disabled, onClick }) => html`
    <vaadin-button theme=${theme || nothing} aria-label="Add item" ?disabled=${disabled} @click=${onClick}>
      <vaadin-icon icon="vaadin:plus"></vaadin-icon>
    </vaadin-button>
  `,
});

export const Disabled = meta.story({
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center">
      ${['', ...VARIANTS].map(
        (theme) => html`<vaadin-button theme=${theme || nothing} disabled>${theme || 'default'}</vaadin-button>`,
      )}
    </div>
  `,
});
