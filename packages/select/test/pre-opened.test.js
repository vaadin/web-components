import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-select.js';

// NOTE: this test is Polymer only as it checks for Polymer specific bug.
// Do not import `not-animated-styles.js` in this test intentionally, as
// otherwise the immediately closed overlay would make it false positive.

describe('pre-opened', () => {
  it('should not throw error when adding a pre-opened select', () => {
    expect(() => {
      fixtureSync('<vaadin-select opened></vaadin-select>');
    }).to.not.throw(Error);
  });
});
