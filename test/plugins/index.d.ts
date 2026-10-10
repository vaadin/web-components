import '@open-wc/semantic-dom-diff';
import 'sinon-chai';

declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Compares the aria snapshot of an element with the one saved for the current test.
       */
      equalAriaSnapshot(): Promise<void>;
    }
  }
}

export { expect } from 'chai';
