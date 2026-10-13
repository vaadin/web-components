import '@open-wc/semantic-dom-diff';
import 'sinon-chai';

declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Compares the accessibility tree of an element with the one saved for the current test.
       */
      equalA11yTreeSnapshot(): Promise<void>;
      /**
       * Runs axe-core rule checks on an element and fails on any violation.
       * Rules in `expectedViolations` must fail, so the test fails once a known issue is fixed.
       */
      accessible(options?: { ignoredRules?: string[]; expectedViolations?: string[] }): Promise<void>;
    }
  }
}

export { expect } from 'chai';
