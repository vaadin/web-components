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

export const LIST_ITEMS = `
  <vaadin-item>Option</vaadin-item>
  <vaadin-item>Other</vaadin-item>
  <vaadin-item>Third</vaadin-item>
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

const BUTTON = { tag: 'vaadin-button', children: 'Button', stateless: true };

const SELECT = {
  tag: 'vaadin-select',
  attrs: { value: 'a' },
  stateless: true,
  setup: (el) => {
    el.items = SELECT_ITEMS;
  },
};

/** Controls that render next to a button. `defs` are the components after the reference text field. */
export const CONTROLS = [
  { name: 'button', defs: [BUTTON], modes: ['small', 'large', 'button height'] },
  {
    name: 'menu-bar',
    defs: [
      BUTTON,
      {
        tag: 'vaadin-menu-bar',
        stateless: true,
        setup: (el) => {
          el.items = [{ text: 'Menu' }, { text: 'Bar' }];
        },
      },
    ],
    modes: ['default', 'small', 'button height'],
  },
  { name: 'badge', defs: [BUTTON, { tag: 'vaadin-badge', children: 'Badge', stateless: true }], modes: ['default'] },
  {
    name: 'avatar',
    defs: [BUTTON, { tag: 'vaadin-avatar', attrs: { abbr: 'AB' }, stateless: true }],
    modes: ['default'],
  },
  { name: 'select', defs: [BUTTON, SELECT], modes: ['default'] },
];

/** Components that render a list of items. */
export const ITEM_LISTS = [
  {
    name: 'list-box',
    defs: [
      { tag: 'vaadin-list-box', attrs: { selected: '0' }, children: LIST_ITEMS, stateless: true },
      {
        tag: 'vaadin-list-box',
        attrs: { multiple: '' },
        children: LIST_ITEMS,
        stateless: true,
        setup: (el) => {
          el.selectedValues = [0, 1];
        },
      },
    ],
  },
  {
    name: 'select',
    defs: [
      {
        ...SELECT,
        overlay: true,
        setup: (el) => {
          SELECT.setup(el);
          el.opened = true;
        },
      },
    ],
  },
];
