import '@open-wc/semantic-dom-diff';
import 'sinon-chai';
import 'wtr-a11y-tree-plugin/chai';

declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Runs axe-core rule checks on an element and fails on any violation.
       * Rules in `expectedViolations` must fail, so the test fails once a known issue is fixed.
       */
      accessible(options?: { ignoredRules?: string[]; expectedViolations?: string[] }): Promise<void>;
    }
  }
}

export { expect } from 'chai';
