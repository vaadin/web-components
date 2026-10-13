import { chaiDomDiff } from '@open-wc/semantic-dom-diff';
import * as chai from 'chai/index.js';
import sinonChai from 'sinon-chai';
import { chaiA11yTree } from 'wtr-a11y-tree-plugin/chai';

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
chai.use(chaiA11yTree);
chai.use(sinonChai);

export const { expect } = chai;
