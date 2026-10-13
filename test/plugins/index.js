import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { a11ySnapshotOfElement, getSnapshot, getSnapshotConfig, saveSnapshot } from '@vaadin/test-runner-commands';

// Snapshots are stored in template literals, which turn escape sequences
// into characters on read, so quote without escaping.
const quote = (text) => `"${text}"`;

const formatText = (text) => (/^[\w$.,!?()•@ ]+$/u.test(text) && !/^\d/u.test(text) ? text : quote(text));

/**
 * Serializes nodes of `a11ySnapshot()` to YAML in the format of Playwright
 * aria snapshots. A description is printed as a `/description` property.
 */
const serializeA11ySnapshot = (nodes, indent = '') =>
  nodes
    .map(({ role, name, description, value, children = [], ...states }) => {
      if (role === 'text') {
        return `${indent}- text: ${formatText(name)}`;
      }
      let line = `${indent}- ${role}`;
      if (name) {
        line += ` ${quote(name)}`;
      }
      const flags = Object.entries(states)
        .filter(([key, state]) => state !== '' && !(key === 'valuetext' && state === value))
        .map(([key, state]) => (state === true || state === 'true' ? key : `${key}=${state}`));
      if (flags.length) {
        line += ` [${flags.join(', ')}]`;
      }
      if (!description && !children.length) {
        return value === undefined ? line : `${line}: ${formatText(String(value))}`;
      }
      return [
        `${line}:`,
        value === undefined ? '' : `${indent}  - /value: ${formatText(String(value))}`,
        description ? `${indent}  - /description: ${formatText(description)}` : '',
        serializeA11ySnapshot(children, `${indent}  `),
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

/**
 * Adds `equalA11yTreeSnapshot()`, which compares the accessibility tree of an
 * element with the one saved for the current test, and saves it when there is
 * none or when the test runner is called with `--update-snapshots`.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiA11ySnapshot = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function equalA11yTreeSnapshot() {
    const element = utils.flag(this, 'object');
    const name = globalThis.__WTR_MOCHA_RUNNER__.test.titlePath().join(' ');
    const { children = [] } = await a11ySnapshotOfElement(element);
    // Web Test Runner does not save an empty snapshot, so the test would check nothing.
    this.assert(
      children.length > 0,
      'expected accessibility tree of the element to have nodes',
      'expected accessibility tree of the element to have no nodes',
    );
    const snapshot = serializeA11ySnapshot(children);
    const currentSnapshot = await getSnapshot({ name });
    const { updateSnapshots } = await getSnapshotConfig();
    if (currentSnapshot && !updateSnapshots) {
      this.assert(
        currentSnapshot === snapshot,
        `Accessibility tree snapshot ${name} does not match the saved snapshot on disk`,
        'expected accessibility tree to differ from the saved snapshot',
        currentSnapshot,
        snapshot,
        true,
      );
    } else if (currentSnapshot !== snapshot) {
      await saveSnapshot({ name, content: snapshot });
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'equalA11yTreeSnapshot', equalA11yTreeSnapshot);
};

/**
 * Adds `accessible()`, which runs axe-core rule checks on an element and
 * fails on any violation.
 *
 * - `ignoredRules` skips rules that are not relevant for the element.
 * - `expectedViolations` lists rules that fail because of a known issue. The
 *   assertion fails when such a rule passes, so that the entry is removed
 *   once the issue is fixed.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiAxe = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function accessible({ ignoredRules = [], expectedViolations = [] } = {}) {
    const element = utils.flag(this, 'object');
    // Load axe-core only in tests that use it.
    await import('axe-core/axe.min.js');
    const rules = Object.fromEntries(ignoredRules.map((id) => [id, { enabled: false }]));
    const { violations } = await globalThis.axe.run(element, { rules, resultTypes: ['violations'] });
    const unexpected = violations.filter(({ id }) => !expectedViolations.includes(id));
    const message = unexpected
      .map(({ id, help, nodes }) => `${id}: ${help}\n${nodes.map((node) => `  ${node.target.join(' ')}`).join('\n')}`)
      .join('\n');
    this.assert(
      unexpected.length === 0,
      `expected element to have no axe violations, found ${unexpected.length}:\n${message}`,
      'expected element to have axe violations',
    );
    const fixed = expectedViolations.filter((id) => !violations.some((violation) => violation.id === id));
    this.assert(
      fixed.length === 0,
      `expected axe to report ${fixed.join(', ')}, but the rule passed. Remove it from expectedViolations if the issue is fixed.`,
      'expected axe to not report the expected violations',
    );
  }

  utils.addMethod(chai.Assertion.prototype, 'accessible', accessible);
};

chai.use(chaiAxe);
chai.use(chaiDomDiff);
chai.use(chaiA11ySnapshot);
chai.use(sinonChai);

export const { expect } = chai;
