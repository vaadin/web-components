import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-card.js';
import type { Card } from '../vaadin-card.js';

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
      card.cardTitle = stringTitle;
      await nextRender();
      const stringTitleElement = getStringTitleElement();
      expect(stringTitleElement).to.exist;
      expect(stringTitleElement.getAttribute('aria-level')).to.equal('2');
      expect(stringTitleElement.textContent).to.equal(stringTitle);
    });

    it('should update aria-level when heading level changes', async () => {
      card.cardTitle = 'Some title';
      card.titleHeadingLevel = 3;
      await nextRender();
      const stringTitleElement = getStringTitleElement();
      expect(stringTitleElement.getAttribute('aria-level')).to.equal('3');
    });

    it('should use default heading level when set to null', async () => {
      card.titleHeadingLevel = 3;
      card.cardTitle = 'Some title';
      card.titleHeadingLevel = null;
      await nextRender();
      expect(getStringTitleElement().getAttribute('aria-level')).to.equal('2');
    });

    it('should clear string title when custom title element is used', async () => {
      card.cardTitle = 'Some title';
      await nextRender();
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender();
      expect(card.cardTitle).to.be.not.ok;
      expect(getStringTitleElement()).to.not.exist;
    });

    it('should clear string title when empty string title is set', async () => {
      card.cardTitle = 'Some title';
      await nextRender();
      card.cardTitle = '';
      await nextRender();
      expect(getStringTitleElement()).to.not.exist;
    });

    it('should clear custom title element when string title is set', async () => {
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender();
      card.cardTitle = 'Some title';
      await nextRender();
      expect(getCustomTitleElement()).to.not.exist;
    });

    it('should not clear custom title element when empty string title is set', async () => {
      const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
      card.appendChild(customTitleElement);
      await nextRender();
      card.cardTitle = '';
      await nextRender();
      expect(getCustomTitleElement()).to.exist;
    });
  });

  describe('sizing', () => {
    it('should size synchronously', async () => {
      const template = `
        <vaadin-card>
          <div slot="title">New Message from Olivia</div>
        </vaadin-card>`;

      card = fixtureSync(template);
      await nextRender();
      const height = card.offsetHeight;

      card = fixtureSync(template);
      expect(card.offsetHeight).to.equal(height);
    });
  });
});
