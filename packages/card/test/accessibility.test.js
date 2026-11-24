import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-card.js';

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
    function getStringTitleElement() {
      return card.querySelector('[slot="title"][role="heading"]');
    }

    it('should not have aria-labelledby attribute by default', () => {
      expect(card.hasAttribute('aria-labelledby')).to.be.false;
    });

    describe('string title', () => {
      beforeEach(async () => {
        card.cardTitle = 'Some title';
        await nextUpdate(card);
      });

      it('should set aria-labelledby attribute to string title id', () => {
        expect(card.getAttribute('aria-labelledby')).to.equal(getStringTitleElement().id);
      });

      it('should set aria-labelledby attribute to custom title id when custom title replaces string title', async () => {
        const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
        card.appendChild(customTitleElement);
        await nextRender();
        expect(card.getAttribute('aria-labelledby')).to.equal(customTitleElement.id);
      });

      it('should set aria-labelledby attribute to string title id when custom title is removed', async () => {
        const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
        card.appendChild(customTitleElement);
        await nextRender();
        customTitleElement.remove();
        await nextRender();
        expect(card.getAttribute('aria-labelledby')).to.equal(getStringTitleElement().id);
      });
    });

    describe('custom title', () => {
      let customTitleElement;

      beforeEach(async () => {
        customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
        card.appendChild(customTitleElement);
        await nextRender();
      });

      it('should set id on custom title element', () => {
        expect(customTitleElement.id).to.match(/^card-title-vaadin-card-\d+$/u);
      });

      it('should set aria-labelledby attribute to custom title id', () => {
        expect(card.getAttribute('aria-labelledby')).to.equal(customTitleElement.id);
      });

      it('should keep aria-labelledby attribute set to custom title id when string title is set', async () => {
        card.cardTitle = 'Some title';
        await nextRender();
        expect(card.getAttribute('aria-labelledby')).to.equal(customTitleElement.id);
      });

      it('should set aria-labelledby attribute to new custom title id when custom title is replaced', async () => {
        const otherTitleElement = fixtureSync('<span slot="title">Other title element</span>');
        card.appendChild(otherTitleElement);
        await nextRender();
        expect(card.getAttribute('aria-labelledby')).to.equal(otherTitleElement.id);
      });

      it('should remove aria-labelledby attribute when custom title is removed', async () => {
        customTitleElement.remove();
        await nextRender();
        expect(card.hasAttribute('aria-labelledby')).to.be.false;
      });
    });

    it('should not override id of custom title element', async () => {
      const customTitleElement = fixtureSync('<span slot="title" id="custom-title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender();
      expect(customTitleElement.id).to.equal('custom-title');
      expect(card.getAttribute('aria-labelledby')).to.equal('custom-title');
    });

    it('should keep aria-labelledby value set on card', async () => {
      card.setAttribute('aria-labelledby', 'app-label');
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender();
      expect(card.getAttribute('aria-labelledby')).to.equal(`app-label ${customTitleElement.id}`);
      customTitleElement.remove();
      await nextRender();
      expect(card.getAttribute('aria-labelledby')).to.equal('app-label');
    });
  });
});
