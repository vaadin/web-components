import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import './styles.css';

/** Attributes that each state adds to a field. */
export const STATES = {
  plain: {},
  label: { label: 'Label' },
  helper: { label: 'Label', 'helper-text': 'Helper' },
  'helper above': { label: 'Label', 'helper-text': 'Helper', theme: 'helper-above-field' },
  error: { label: 'Label', 'error-message': 'Error', invalid: '' },
  'required with helper above': { label: 'Label', 'helper-text': 'Helper', required: '', theme: 'helper-above-field' },
};

/**
 * Attributes that each mode adds to every component in a fixture, and styles for the container.
 * The `dir` of a mode goes on the document, see `useMode()`.
 */
export const MODES = {
  default: {},
  small: { theme: 'small' },
  large: { theme: 'large' },
  'label aside': { theme: 'label-aside' },
  'input field height': { style: '--vaadin-input-field-height: 56px' },
  'button height': { style: '--vaadin-button-height: 48px' },
  rtl: { dir: 'rtl' },
};

/**
 * Registers the hooks that a mode needs. Call it inside the describe block of the mode.
 * Components only read the direction from the document, so the rtl mode sets it there.
 * @param {string} mode
 */
export function useMode(mode) {
  const { dir } = MODES[mode];
  if (dir) {
    before(() => document.documentElement.setAttribute('dir', dir));
    after(() => document.documentElement.removeAttribute('dir'));
  }
}

/** The text field that every row renders next to the anchor text. */
export const REFERENCE = { tag: 'vaadin-text-field', attrs: { value: 'Value' } };

/**
 * Returns the screenshot name for a component, mode and state.
 * @param {string} component
 * @param {string} mode
 * @param {string} state
 * @return {string}
 */
export function screenshotName(component, mode, state) {
  return [component, mode, state].join('-').replaceAll(' ', '-');
}

function renderAttrs(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => (value === '' ? name : `${name}="${value}"`))
    .join(' ');
}

/**
 * Returns the HTML of one component with the attributes of the given mode and state.
 * A component with `stateless: true` only receives the mode attributes.
 * A `children` function receives the options, so that child components can follow the mode.
 * The `attrs` option overrides attributes last, `undefined` removes one.
 * @param {{ tag: string, attrs?: object, children?: string | Function, stateless?: boolean }} def
 * @param {{ mode?: string, state?: string, attrs?: object }} options
 * @return {string}
 */
export function field(def, { mode = 'default', state = 'plain', attrs: overrides } = {}) {
  const { theme: modeTheme } = MODES[mode];
  const { theme: stateTheme, ...stateAttrs } = def.stateless ? {} : STATES[state];
  const { theme: ownTheme, ...ownAttrs } = def.attrs || {};
  const theme = [ownTheme, modeTheme, stateTheme].filter(Boolean).join(' ') || undefined;
  const attrs = renderAttrs({ ...ownAttrs, ...stateAttrs, theme, ...overrides });
  const children = typeof def.children === 'function' ? def.children({ mode, state }) : def.children;
  return `<${def.tag} ${attrs}>${children || ''}</${def.tag}>`;
}

async function setup(container, defs, offset) {
  const elements = [...container.children].slice(offset);
  await Promise.all(defs.map((def, index) => def.setup && def.setup(elements[index])));
  await nextFrame();
  return container;
}

function containerAttrs(mode, className) {
  return renderAttrs({ class: className, style: MODES[mode].style });
}

/**
 * Renders the anchor text, the reference text field and up to two components in one baseline row.
 * @param {object | object[]} defs
 * @param {{ mode?: string, state?: string }} options
 * @return {Promise<HTMLElement>}
 */
export function row(defs, options = {}) {
  defs = [defs].flat();
  const { mode = 'default' } = options;
  const className = defs.some((def) => def.overlay) ? 'row overlay' : 'row';
  const container = fixtureSync(`
    <div ${containerAttrs(mode, className)}>
      <span>Text</span>
      ${field(REFERENCE, options)}
      ${defs.map((def) => field(def, options)).join('')}
    </div>
  `);
  return setup(container, defs, 2);
}

/**
 * Renders components in a vertical layout.
 * @param {object[]} defs
 * @param {{ mode?: string, state?: string }} options
 * @return {Promise<HTMLElement>}
 */
export async function stack(defs, options = {}) {
  const { mode = 'default' } = options;
  const container = fixtureSync(`
    <div ${containerAttrs(mode, 'stack')}>
      <vaadin-vertical-layout>
        ${defs.map((def) => field(def, options)).join('')}
      </vaadin-vertical-layout>
    </div>
  `);
  await setup(container.firstElementChild, defs, 0);
  return container;
}

/** Form layout configurations. `formItems` wraps each field in a form item that holds the label. */
export const FORM_LAYOUTS = {
  'labels on top': { steps: [{ columns: 2 }] },
  'labels aside': { steps: [{ columns: 2, labelsPosition: 'aside' }], formItems: true },
  'auto-responsive labels aside': { attrs: { 'auto-responsive': '', 'labels-aside': '', 'max-columns': '2' } },
};

function formItem(def, options) {
  const html = field(def, { ...options, attrs: { label: undefined } });
  return `<vaadin-form-item><label slot="label">Label</label>${html}</vaadin-form-item>`;
}

/**
 * Renders fields in a form layout.
 * @param {object[]} defs
 * @param {{ layout: string, state?: string }} options
 * @return {Promise<HTMLElement>}
 */
export async function form(defs, { layout, state }) {
  const { steps, attrs = {}, formItems } = FORM_LAYOUTS[layout];
  const render = formItems ? formItem : field;
  const container = fixtureSync(`
    <div class="form">
      <vaadin-form-layout ${renderAttrs(attrs)}>
        ${defs.map((def) => render(def, { state })).join('')}
      </vaadin-form-layout>
    </div>
  `);
  const layoutElement = container.firstElementChild;
  if (steps) {
    layoutElement.responsiveSteps = steps;
  }
  const fields = defs.map((_, index) => {
    const child = layoutElement.children[index];
    return formItems ? child.lastElementChild : child;
  });
  await Promise.all(defs.map((def, index) => def.setup && def.setup(fields[index])));
  await nextResize(layoutElement);
  await nextFrame();
  return container;
}
