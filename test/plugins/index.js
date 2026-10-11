import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { getSnapshot, getSnapshotConfig, saveSnapshot } from '@web/test-runner-commands';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { getA11yTree } from '@vaadin/test-runner-commands';

// States printed even when `false`, as `false` differs from a missing state.
const A11Y_FALSE_STATES = new Set(['expanded', 'pressed']);

// Snapshots are stored in template literals, which turn escape sequences
// into characters on read, so quote without escaping.
const quote = (text) => `"${text}"`;

const formatText = (text) => (/^[\w$.,!?()•@ ]+$/u.test(text) && !/^\d/u.test(text) ? text : quote(text));

const formatStates = (node) =>
  Object.entries(node.states || {})
    .map(([key, value]) => {
      if (value === true || value === 'true') {
        return key.toLowerCase();
      }
      if (value === false || value === 'false') {
        return A11Y_FALSE_STATES.has(key) ? `${key}=false` : null;
      }
      if (value === '' || (key === 'valuetext' && String(value) === node.value)) {
        return null;
      }
      return `${key.toLowerCase()}=${value}`;
    })
    .filter(Boolean);

/**
 * Removes text that repeats the parent name, such as the label of a button.
 */
const normalizeChildren = (children, parentName) =>
  (children || []).filter((child) => !(child.role === 'text' && child.name === parentName));

/**
 * Serializes an accessibility tree to YAML in the format of Playwright aria
 * snapshots. Descriptions and relations are printed as `/description` and
 * `/<relation>` properties, like `/url` in Playwright.
 */
const serializeA11yTree = (nodes, indent = '') =>
  normalizeChildren(nodes)
    .map((node) => {
      if (node.role === 'text') {
        return `${indent}- text: ${formatText(node.name)}`;
      }
      let children = normalizeChildren(node.children, node.name);
      let line = `${indent}- ${node.role}`;
      if (node.name) {
        line += ` ${quote(node.name)}`;
      }
      const states = formatStates(node);
      if (states.length) {
        line += ` [${states.join(', ')}]`;
      }
      let inline = node.value;
      if (inline === undefined && children.length === 1 && children[0].role === 'text') {
        inline = children[0].name;
        children = [];
      }
      const props = [];
      if (node.description) {
        props.push(`${indent}  - /description: ${formatText(node.description)}`);
      }
      Object.entries(node.relations || {}).forEach(([key, targets]) => {
        targets.forEach(({ role, name }) => {
          props.push(`${indent}  - /${key}: ${role}${name ? ` ${quote(name)}` : ''}`);
        });
      });
      const nested = children.length ? serializeA11yTree(children, `${indent}  `) : '';
      if (!props.length && !nested) {
        return inline === undefined ? line : `${line}: ${formatText(inline)}`;
      }
      const head = inline === undefined ? `${line}:` : `${line}:\n${indent}  - /value: ${formatText(inline)}`;
      return [head, ...props, nested].filter(Boolean).join('\n');
    })
    .join('\n');

/**
 * Adds `equalA11yTreeSnapshot()`, which compares the Chromium accessibility
 * tree of an element with the one saved for the current test, and saves it
 * when there is none or when the test runner is called with `--update-snapshots`.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiA11yTreeSnapshot = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function equalA11yTreeSnapshot() {
    const element = utils.flag(this, 'object');
    const name = globalThis.__WTR_MOCHA_RUNNER__.test.titlePath().join(' ');
    const snapshot = serializeA11yTree(await getA11yTree(element));
    const currentSnapshot = await getSnapshot({ name });
    const config = await getSnapshotConfig();

    if (currentSnapshot && !config.updateSnapshots) {
      if (currentSnapshot !== snapshot) {
        throw new chai.AssertionError(
          `Accessibility tree snapshot ${name} does not match the saved snapshot on disk`,
          { actual: snapshot, expected: currentSnapshot, showDiff: true },
          utils.flag(this, 'ssfi'),
        );
      }
    } else if (currentSnapshot !== snapshot) {
      await saveSnapshot({ name, content: snapshot });
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'equalA11yTreeSnapshot', equalA11yTreeSnapshot);
};

/**
 * Adds `accessible()`, which runs axe-core rule checks on an element and
 * fails on any violation. Pass `ignoredRules` to skip rules for a test.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiAxe = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function accessible({ ignoredRules = [] } = {}) {
    const element = utils.flag(this, 'object');
    // Load axe-core only in tests that use it.
    await import('axe-core/axe.min.js');
    const rules = Object.fromEntries(ignoredRules.map((id) => [id, { enabled: false }]));
    const { violations } = await globalThis.axe.run(element, { rules, resultTypes: ['violations'] });
    const message = violations
      .map(({ id, help, nodes }) => `${id}: ${help}\n${nodes.map((node) => `  ${node.target.join(' ')}`).join('\n')}`)
      .join('\n');
    this.assert(
      violations.length === 0,
      `expected element to have no axe violations, found ${violations.length}:\n${message}`,
      'expected element to have axe violations',
    );
  }

  utils.addMethod(chai.Assertion.prototype, 'accessible', accessible);
};

chai.use(chaiAxe);
chai.use(chaiDomDiff);
chai.use(chaiA11yTreeSnapshot);
chai.use(sinonChai);

export const { expect } = chai;
