import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-badge.js';

describe('badge', () => {
  let badge;

  beforeEach(async () => {
    badge = fixtureSync(`
      <vaadin-badge>Hello</vaadin-badge>
    `);

    await nextFrame();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = badge.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });
});
