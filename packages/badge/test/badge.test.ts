import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-badge.js';
import type { Badge } from '../src/vaadin-badge.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.badgeComponent = true;

describe('vaadin-badge', () => {
  let badge: Badge;

  beforeEach(async () => {
    badge = fixtureSync('<vaadin-badge></vaadin-badge>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName: string;

    beforeEach(() => {
      tagName = badge.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get(tagName) as any).is).to.equal(tagName);
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
