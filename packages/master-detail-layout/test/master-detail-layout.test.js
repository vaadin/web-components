import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-master-detail-layout.js';

describe('vaadin-master-detail-layout', () => {
  let layout;

  beforeEach(() => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <div>Master content</div>
        <div slot="detail">Detail content</div>
      </vaadin-master-detail-layout>
    `);
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = layout.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });
});
