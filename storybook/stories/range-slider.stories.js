import '@vaadin/slider/vaadin-range-slider.js';
import { html } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const meta = preview.meta({
  title: 'Range Slider',
  component: 'vaadin-range-slider',
  args: {
    label: 'Price range',
    helperText: '',
    min: 0,
    max: 1000,
    step: 10,
    value: [200, 800],
    minMaxVisible: false,
    valueAlwaysVisible: false,
    disabled: false,
    readonly: false,
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'object', description: 'Start and end values, for example [200, 800]' },
  },
  render: (args) => html`
    <vaadin-range-slider
      .label=${args.label}
      .helperText=${args.helperText}
      .min=${args.min}
      .max=${args.max}
      .step=${args.step}
      .value=${args.value}
      ?min-max-visible=${args.minMaxVisible}
      ?value-always-visible=${args.valueAlwaysVisible}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      @change=${args.onChange}
    ></vaadin-range-slider>
  `,
});

export const Default = meta.story();

export const MinMaxVisible = meta.story({
  args: { minMaxVisible: true },
});

export const Disabled = meta.story({
  args: { disabled: true },
});
