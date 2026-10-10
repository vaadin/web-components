import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import { getSnapshot, getSnapshotConfig, saveSnapshot } from '@web/test-runner-commands';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { ariaSnapshot } from '@vaadin/test-runner-commands';

/**
 * Adds `equalAriaSnapshot()`, which compares the aria snapshot of an element
 * with the one saved for the current test, and saves it when there is none
 * or when the test runner is called with `--update-snapshots`.
 *
 * @type {Chai.ChaiPlugin}
 */
const chaiAriaSnapshot = (chai, utils) => {
  /** @this {Chai.AssertionStatic} */
  async function equalAriaSnapshot() {
    const element = utils.flag(this, 'object');
    const name = globalThis.__WTR_MOCHA_RUNNER__.test.titlePath().join(' ');
    const snapshot = await ariaSnapshot(element);
    const currentSnapshot = await getSnapshot({ name });
    const config = await getSnapshotConfig();

    if (currentSnapshot && !config.updateSnapshots) {
      if (currentSnapshot !== snapshot) {
        throw new chai.AssertionError(
          `Aria snapshot ${name} does not match the saved snapshot on disk`,
          { actual: snapshot, expected: currentSnapshot, showDiff: true },
          utils.flag(this, 'ssfi'),
        );
      }
    } else if (currentSnapshot !== snapshot) {
      await saveSnapshot({ name, content: snapshot });
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'equalAriaSnapshot', equalAriaSnapshot);
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
chai.use(chaiAriaSnapshot);
chai.use(sinonChai);

export const { expect } = chai;
