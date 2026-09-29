import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './styles.css';

/** Attributes that each state adds to a field. */
export const STATES = {
  plain: {},
  label: { label: 'Label' },
  helper: { label: 'Label', 'helper-text': 'Helper' },
  'helper above': { label: 'Label', 'helper-text': 'Helper', theme: 'helper-above-field' },
  error: { label: 'Label', 'error-message': 'Error', invalid: '' },
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
 * @param {{ tag: string, attrs?: object, children?: string | Function, stateless?: boolean }} def
 * @param {{ mode?: string, state?: string }} options
 * @return {string}
 */
export function field(def, { mode = 'default', state = 'plain' } = {}) {
  const { theme: modeTheme } = MODES[mode];
  const { theme: stateTheme, ...stateAttrs } = def.stateless ? {} : STATES[state];
  const { theme: ownTheme, ...ownAttrs } = def.attrs || {};
  const theme = [ownTheme, modeTheme, stateTheme].filter(Boolean).join(' ') || undefined;
  const attrs = renderAttrs({ ...ownAttrs, ...stateAttrs, theme });
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
  const container = fixtureSync(`
    <div ${containerAttrs(mode, 'row')}>
      <span>Text</span>
      ${field(REFERENCE, options)}
      ${defs.map((def) => field(def, options)).join('')}
    </div>
  `);
  return setup(container, defs, 2);
}
