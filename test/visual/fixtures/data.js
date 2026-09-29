import { field } from './html.js';

export const SELECT_ITEMS = [
  { label: 'Option', value: 'a' },
  { label: 'Other', value: 'b' },
  { label: 'Third', value: 'c' },
];

export const CHECKBOXES = `
  <vaadin-checkbox value="a" label="A"></vaadin-checkbox>
  <vaadin-checkbox value="b" label="B"></vaadin-checkbox>
`;

export const RADIO_BUTTONS = `
  <vaadin-radio-button value="a" label="A"></vaadin-radio-button>
  <vaadin-radio-button value="b" label="B"></vaadin-radio-button>
`;

export const DATE_TIME = '2024-01-15T10:30';

/** Child fields of a custom field. They follow the small mode only, since they have no label. */
export const CUSTOM_FIELD_CHILDREN = ({ mode }) =>
  [
    { tag: 'vaadin-text-field', attrs: { value: 'Custom' }, stateless: true },
    { tag: 'vaadin-number-field', attrs: { value: '1' }, stateless: true },
  ]
    .map((def) => field(def, { mode: mode === 'small' ? mode : 'default' }))
    .join('');

const ALL_STATES = ['plain', 'label', 'helper', 'helper above', 'error'];

/** States that each mode renders, in the order of the screenshots. */
export const FIELD_MODES = {
  default: ALL_STATES,
  small: ALL_STATES,
  'label aside': ['label', 'helper', 'error'],
  'input field height': ['plain', 'label'],
  rtl: ['label', 'error'],
};

function pickModes(...modes) {
  return Object.fromEntries(modes.map((mode) => [mode, FIELD_MODES[mode]]));
}

/** Fields for the baseline rows. `modes` overrides `FIELD_MODES` where a mode or state does not apply. */
export const FIELDS = [
  { tag: 'vaadin-text-area', attrs: { value: 'Value' } },
  {
    tag: 'vaadin-select',
    attrs: { value: 'a' },
    setup: (el) => {
      el.items = SELECT_ITEMS;
    },
  },
  { tag: 'vaadin-date-time-picker', attrs: { value: DATE_TIME } },
  {
    tag: 'vaadin-custom-field',
    children: CUSTOM_FIELD_CHILDREN,
  },
  {
    tag: 'vaadin-checkbox-group',
    children: CHECKBOXES,
    setup: (el) => {
      el.value = ['a'];
    },
  },
  { tag: 'vaadin-radio-group', attrs: { value: 'a' }, children: RADIO_BUTTONS },
  { tag: 'vaadin-slider', attrs: { value: '50' } },
  { tag: 'vaadin-checkbox', attrs: { checked: '' }, modes: pickModes('default', 'rtl') },
  {
    tag: 'vaadin-button',
    children: 'Button',
    stateless: true,
    modes: { default: ['plain'], small: ['plain'], 'input field height': ['plain'], rtl: ['plain'] },
  },
];
