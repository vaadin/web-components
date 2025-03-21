import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-card.js';
import type { Card } from '../vaadin-card.js';

window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.cardComponent = true;

describe('vaadin-card', () => {
  let card: Card;

  beforeEach(() => {
    card = fixtureSync('<vaadin-card></vaadin-card>');
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = card.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
    });
  });

  describe('title', () => {
    function getStringTitleElement() {
      return card.querySelector('[slot="title"][card-string-title]') as HTMLElement;
    }

    function getCustomTitleElement() {
      return Array.from(card.querySelectorAll('[slot="title"]')).find((el) => {
        return !el.hasAttribute('card-string-title');
      });
    }

    it('should create title element with default aria-level when title property is set', async () => {
      const stringTitle = 'Some title';
      card.title = stringTitle;
      await nextRender(card);
      const stringTitleElement = getStringTitleElement();
      expect(stringTitleElement).to.exist;
      expect(stringTitleElement.getAttribute('aria-level')).to.equal('2');
      expect(stringTitleElement.textContent).to.equal(stringTitle);
    });

    it('should update aria-level when heading level changes', async () => {
      card.title = 'Some title';
      card.titleHeadingLevel = 3;
      await nextRender(card);
      const stringTitleElement = getStringTitleElement();
      expect(stringTitleElement.getAttribute('aria-level')).to.equal('3');
    });

    it('should use default heading level when set to null', async () => {
      card.titleHeadingLevel = 3;
      card.title = 'Some title';
      card.titleHeadingLevel = null;
      await nextRender(card);
      expect(getStringTitleElement().getAttribute('aria-level')).to.equal('2');
    });

    it('should clear string title when custom title element is used', async () => {
      card.title = 'Some title';
      await nextRender(card);
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender(card);
      expect(card.title).to.be.not.ok;
      expect(getStringTitleElement()).to.not.exist;
    });

    it('should clear string title when empty string title is set', async () => {
      card.title = 'Some title';
      await nextRender(card);
      card.title = '';
      await nextRender(card);
      expect(getStringTitleElement()).to.not.exist;
    });

    it('should clear custom title element when string title is set', async () => {
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender(card);
      card.title = 'Some title';
      await nextRender(card);
      expect(getCustomTitleElement()).to.not.exist;
    });

    it('should not clear custom title element when empty string title is set', async () => {
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender(card);
      card.title = '';
      await nextRender(card);
      expect(getCustomTitleElement()).to.exist;
    });
  });
});
