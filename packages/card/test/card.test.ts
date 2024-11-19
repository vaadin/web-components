import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-card.js';
import type { Card } from '../vaadin-card.js';

window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.cardComponent = true;

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
