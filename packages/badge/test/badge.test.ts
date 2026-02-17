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

  describe('has-content attribute', () => {
    it('should not set has-content attribute by default', () => {
      expect(badge.hasAttribute('has-content')).to.be.false;
    });

    it('should toggle has-content attribute on text content change', async () => {
      badge.textContent = 'Text';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.true;

      badge.textContent = '';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.false;
    });

    it('should toggle has-content attribute on element content change', async () => {
      const span = document.createElement('span');
      span.textContent = 'Content';
      badge.appendChild(span);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.true;

      badge.removeChild(span);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.false;
    });

    it('should not set has-content attribute when content is only whitespace', async () => {
      badge.textContent = '   ';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.false;
    });
  });

  describe('has-prefix attribute', () => {
    it('should not set has-prefix attribute by default', () => {
      expect(badge.hasAttribute('has-prefix')).to.be.false;
    });

    it('should toggle has-prefix attribute on prefix slot content change', async () => {
      const prefix = document.createElement('span');
      prefix.setAttribute('slot', 'prefix');
      badge.appendChild(prefix);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-prefix')).to.be.true;

      badge.removeChild(prefix);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-prefix')).to.be.false;
    });
  });
});
