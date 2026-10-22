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
      return card.querySelector('[slot="title"][role="heading"]') as HTMLElement;
    }

    function getCustomTitleElement() {
      return Array.from(card.querySelectorAll('[slot="title"]')).find((el) => {
        return el.getAttribute('role') !== 'heading';
      });
    }

    it('should not throw when clearing string title before it is rendered', async () => {
      card.cardTitle = 'Some title';
      card.cardTitle = '';
      await nextRender();
      expect(getStringTitleElement()).to.not.exist;
    });

    describe('default title', () => {
      beforeEach(async () => {
        card.cardTitle = 'Some title';
        await nextRender();
      });

      it('should create title element with default aria-level', () => {
        const stringTitleElement = getStringTitleElement();
        expect(stringTitleElement).to.exist;
        expect(stringTitleElement.getAttribute('aria-level')).to.equal('2');
        expect(stringTitleElement.textContent).to.equal('Some title');
      });

      it('should update aria-level when heading level changes', async () => {
        card.headingLevel = 3;
        await nextRender();
        expect(getStringTitleElement().getAttribute('aria-level')).to.equal('3');
      });

      it('should use default heading level when set to null', async () => {
        card.headingLevel = 3;
        await nextRender();
        card.headingLevel = null;
        await nextRender();
        expect(getStringTitleElement().getAttribute('aria-level')).to.equal('2');
      });

      it('should update aria-level when heading-level attribute changes', async () => {
        card.setAttribute('heading-level', '4');
        await nextRender();
        expect(getStringTitleElement().getAttribute('aria-level')).to.equal('4');
      });

      it('should reflect heading level to attribute', async () => {
        card.headingLevel = 3;
        await nextRender();
        expect(card.getAttribute('heading-level')).to.equal('3');
      });

      describe('deprecated titleHeadingLevel', () => {
        it('should update aria-level when title heading level changes', async () => {
          card.titleHeadingLevel = 3;
          await nextRender();
          expect(card.headingLevel).to.equal(3);
          expect(getStringTitleElement().getAttribute('aria-level')).to.equal('3');
        });

        it('should use default heading level when title heading level set to null', async () => {
          card.titleHeadingLevel = 3;
          await nextRender();
          card.titleHeadingLevel = null;
          await nextRender();
          expect(getStringTitleElement().getAttribute('aria-level')).to.equal('2');
        });

        it('should update aria-level when title-heading-level attribute changes', async () => {
          card.setAttribute('title-heading-level', '4');
          await nextRender();
          expect(getStringTitleElement().getAttribute('aria-level')).to.equal('4');
        });
      });

      it('should keep string title value when custom title element is used', async () => {
        card.appendChild(fixtureSync('<span slot="title">Custom title element</span>'));
        await nextRender();
        expect(card.cardTitle).to.equal('Some title');
        expect(getStringTitleElement()).to.not.exist;
        expect(getCustomTitleElement()).to.exist;
      });

      it('should restore string title when custom title element is removed', async () => {
        const customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
        card.appendChild(customTitleElement);
        await nextRender();
        customTitleElement.remove();
        await nextRender();
        expect(getStringTitleElement().textContent).to.equal('Some title');
      });

      it('should clear string title when empty string title is set', async () => {
        card.cardTitle = '';
        await nextRender();
        expect(getStringTitleElement()).to.not.exist;
      });

      it('should restore string title when title element is removed', async () => {
        getStringTitleElement().remove();
        await nextRender();
        const stringTitleElement = getStringTitleElement();
        expect(stringTitleElement.textContent).to.equal('Some title');
        expect(card.getAttribute('aria-labelledby')).to.equal(stringTitleElement.id);
      });
    });

    describe('custom title', () => {
      let customTitleElement: HTMLElement;

      beforeEach(async () => {
        customTitleElement = fixtureSync('<span slot="title">Custom title element</span>');
        card.appendChild(customTitleElement);
        await nextRender();
      });

      it('should keep custom title element when string title is set', async () => {
        card.cardTitle = 'Some title';
        await nextRender();
        expect(getCustomTitleElement()).to.equal(customTitleElement);
        expect(getStringTitleElement()).to.not.exist;
      });

      it('should not clear custom title element when blank string title is set', async () => {
        card.cardTitle = ' ';
        await nextRender();
        expect(getCustomTitleElement()).to.equal(customTitleElement);
      });

      it('should restore string title when custom title element is removed', async () => {
        card.cardTitle = 'Some title';
        await nextRender();
        customTitleElement.remove();
        await nextRender();
        const stringTitleElement = getStringTitleElement();
        expect(stringTitleElement.textContent).to.equal('Some title');
        expect(stringTitleElement.getAttribute('aria-level')).to.equal('2');
        expect(card.getAttribute('aria-labelledby')).to.equal(stringTitleElement.id);
      });

      it('should restore string title when set in the same tick as custom title element is removed', async () => {
        card.cardTitle = 'Some title';
        customTitleElement.remove();
        await nextRender();
        expect(getStringTitleElement().textContent).to.equal('Some title');
      });

      it('should not restore string title when it is cleared before custom title element is removed', async () => {
        card.cardTitle = 'Some title';
        await nextRender();
        card.cardTitle = '';
        await nextRender();
        customTitleElement.remove();
        await nextRender();
        expect(getStringTitleElement()).to.not.exist;
        expect(card.hasAttribute('aria-labelledby')).to.be.false;
      });
    });

    describe('string and custom title initially', () => {
      beforeEach(async () => {
        card = fixtureSync(`
          <vaadin-card card-title="Some title">
            <span slot="title">Custom title element</span>
          </vaadin-card>
        `);
        await nextRender();
      });

      it('should keep custom title element and string title value', () => {
        expect(getCustomTitleElement()).to.exist;
        expect(getStringTitleElement()).to.not.exist;
        expect(card.cardTitle).to.equal('Some title');
      });
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
