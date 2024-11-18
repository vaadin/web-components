import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import type { Card } from '../vaadin-card.js';

describe('vaadin-card', () => {
  let card: Card;

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      card = fixtureSync('<vaadin-card></vaadin-card>');
      tagName = card.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });
});
