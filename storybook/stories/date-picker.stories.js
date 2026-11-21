import '@vaadin/date-picker';
import { html } from 'lit';
import { fn } from 'storybook/test';
import preview from '../.storybook/preview';

const meta = preview.meta({
  title: 'Date Picker',
  component: 'vaadin-date-picker',
  args: {
    label: 'Start date',
    placeholder: '',
    helperText: '',
    value: '',
    min: '',
    max: '',
    showWeekNumbers: false,
    clearButtonVisible: false,
    disabled: false,
    readonly: false,
    i18n: {},
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'text', description: 'Date in ISO format, for example 2026-11-18' },
  },
  render: (args) => html`
    <vaadin-date-picker
      .i18n=${args.i18n}
      .label=${args.label}
      .placeholder=${args.placeholder}
      .helperText=${args.helperText}
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      ?show-week-numbers=${args.showWeekNumbers}
      ?clear-button-visible=${args.clearButtonVisible}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      @change=${args.onChange}
    ></vaadin-date-picker>
  `,
});

export const Default = meta.story();

export const MinAndMax = meta.story({
  args: {
    label: 'Appointment date',
    helperText: 'Within the next 30 days',
    min: '2026-11-18',
    max: '2026-12-18',
    value: '2026-11-20',
  },
});

export const WeekNumbers = meta.story({
  args: {
    showWeekNumbers: true,
    // Week numbers show only when weeks start on Monday
    i18n: { firstDayOfWeek: 1 },
  },
});
