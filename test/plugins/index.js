import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { chaiA11yTree } from 'wtr-a11y-tree-plugin/chai';

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
chai.use(chaiA11yTree);
chai.use(sinonChai);

export const { expect } = chai;
