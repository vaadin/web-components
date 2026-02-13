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

    it('should set has-content attribute when badge has text content', async () => {
      badge.textContent = 'Text';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.true;
    });

    it('should set has-content attribute when badge has element content', async () => {
      const span = document.createElement('span');
      span.textContent = 'Content';
      badge.appendChild(span);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.true;
    });

    it('should not set has-content attribute when content is only whitespace', async () => {
      badge.textContent = '   ';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.false;
    });

    it('should remove has-content attribute when content is removed', async () => {
      badge.textContent = 'Text';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.true;

      badge.textContent = '';
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-content')).to.be.false;
    });
  });

  describe('has-icon attribute', () => {
    it('should not set has-icon attribute by default', () => {
      expect(badge.hasAttribute('has-icon')).to.be.false;
    });

    it('should set has-icon attribute when icon slot has content', async () => {
      const icon = document.createElement('span');
      icon.setAttribute('slot', 'icon');
      badge.appendChild(icon);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-icon')).to.be.true;
    });

    it('should remove has-icon attribute when icon is removed', async () => {
      const icon = document.createElement('span');
      icon.setAttribute('slot', 'icon');
      badge.appendChild(icon);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-icon')).to.be.true;

      badge.removeChild(icon);
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-icon')).to.be.false;
    });
  });
});
