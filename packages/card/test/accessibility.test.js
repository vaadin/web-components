import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-card.js';

window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.cardComponent = true;

describe('accessibility', () => {
  let card;

  beforeEach(async () => {
    card = fixtureSync('<vaadin-card></vaadin-card>');
    await nextRender();
  });

  describe('ARIA roles', () => {
    it('should set "region" role by default on card', () => {
      expect(card.getAttribute('role')).to.equal('region');
    });
  });

  describe('label', () => {
    it('should not have aria-labelledby attribute by default', () => {
      expect(card.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should have aria-labelledby attribute when title property is set', async () => {
      card.cardTitle = 'Some title';
      await nextUpdate(card);
      expect(card.hasAttribute('aria-labelledby')).to.be.true;
    });

    it('should remove aria-labelledby attribute when custom title element is set', async () => {
      card.cardTitle = 'Some title';
      await nextUpdate(card);
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender();
      expect(card.hasAttribute('aria-labelledby')).to.be.false;
    });
  });
});
