import '@vaadin/slider';
import { html } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const meta = preview.meta({
  title: 'Slider',
  component: 'vaadin-slider',
  args: {
    label: 'Volume',
    helperText: '',
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    minMaxVisible: false,
    valueAlwaysVisible: false,
    disabled: false,
    readonly: false,
    onChange: fn(),
  },
  render: (args) => html`
    <vaadin-slider
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
    ></vaadin-slider>
  `,
});

export const Default = meta.story();

export const MinMaxVisible = meta.story({
  args: { minMaxVisible: true },
});

export const Step = meta.story({
  args: { label: 'Rating', min: 1, max: 5, step: 1, value: 3, minMaxVisible: true },
});
