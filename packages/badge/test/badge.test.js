import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-badge.js';

describe('vaadin-badge', () => {
  let badge;

  beforeEach(async () => {
    badge = fixtureSync('<vaadin-badge></vaadin-badge>');
    await nextUpdate(badge);
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

  describe('default slot', () => {
    it('should accept text content', async () => {
      badge.textContent = 'New';
      await nextUpdate(badge);
      expect(badge.textContent).to.equal('New');
    });

    it('should accept element content', () => {
      const span = document.createElement('span');
      span.textContent = 'Badge';
      badge.appendChild(span);
      expect(badge.querySelector('span')).to.equal(span);
    });
  });

  describe('empty state', () => {
    it('should have empty attribute when badge has no content', () => {
      expect(badge.hasAttribute('empty')).to.be.true;
    });

    it('should not have empty attribute when badge has text content', async () => {
      badge.textContent = 'Text';
      await nextUpdate(badge);
      expect(badge.hasAttribute('empty')).to.be.false;
    });

    it('should not have empty attribute when badge has element content', async () => {
      const span = document.createElement('span');
      span.textContent = 'Content';
      badge.appendChild(span);
      await nextUpdate(badge);
      expect(badge.hasAttribute('empty')).to.be.false;
    });

    it('should have empty attribute when content is only whitespace', async () => {
      badge.textContent = '   ';
      await nextUpdate(badge);
      expect(badge.hasAttribute('empty')).to.be.true;
    });

    it('should update empty attribute when content is added', async () => {
      expect(badge.hasAttribute('empty')).to.be.true;
      badge.textContent = 'New';
      await nextUpdate(badge);
      expect(badge.hasAttribute('empty')).to.be.false;
    });

    it('should update empty attribute when content is removed', async () => {
      badge.textContent = 'Text';
      await nextUpdate(badge);
      expect(badge.hasAttribute('empty')).to.be.false;

      badge.textContent = '';
      await nextUpdate(badge);
      expect(badge.hasAttribute('empty')).to.be.true;
    });
  });
});
