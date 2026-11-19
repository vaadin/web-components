import '@vaadin/select';
import '@vaadin/list-box';
import '@vaadin/item';
import { html } from 'lit';
import { fn } from 'storybook/test';
import { selectRenderer } from '@vaadin/select/lit.js';
import preview from '../.storybook/preview';
import { people } from './data.js';

const SORT_ITEMS = [
  { label: 'Most recent first', value: 'recent' },
  { label: 'Rating: high to low', value: 'rating-desc' },
  { label: 'Rating: low to high', value: 'rating-asc' },
  { component: 'hr' },
  { label: 'Price: high to low', value: 'price-desc', disabled: true },
];

const meta = preview.meta({
  title: 'Fields/Select',
  component: 'vaadin-select',
  args: {
    label: 'Sort by',
    placeholder: 'Select an option',
    helperText: '',
    value: '',
    disabled: false,
    readonly: false,
    required: false,
    onChange: fn(),
  },
  render: (args) => html`
    <vaadin-select
      .label=${args.label}
      .placeholder=${args.placeholder}
      .helperText=${args.helperText}
      .items=${SORT_ITEMS}
      .value=${args.value}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      @change=${args.onChange}
    ></vaadin-select>
  `,
});

export const Default = meta.story();

export const Preselected = meta.story({
  args: { value: 'rating-desc' },
});

export const CustomRenderer = meta.story({
  args: { label: 'Assignee' },
  render: ({ label }) => html`
    <vaadin-select
      .label=${label}
      ${selectRenderer(
        () => html`
          <vaadin-list-box>
            ${people
              .slice(0, 6)
              .map(
                (person) => html`
                  <vaadin-item value=${person.id}>${person.firstName} ${person.lastName}</vaadin-item>
                `,
              )}
          </vaadin-list-box>
        `,
      )}
    ></vaadin-select>
  `,
});
