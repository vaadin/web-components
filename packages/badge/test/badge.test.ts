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

  describe('has-number attribute', () => {
    it('should not set has-number attribute by default', () => {
      expect(badge.hasAttribute('has-number')).to.be.false;
    });

    it('should set has-number attribute when number property is set', async () => {
      badge.number = 5;
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-number')).to.be.true;
    });

    it('should remove has-number attribute when number is set to null', async () => {
      badge.number = 5;
      await nextUpdate(badge);
      badge.number = null;
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-number')).to.be.false;
    });

    it('should remove has-number attribute when number is set to undefined', async () => {
      badge.number = 5;
      await nextUpdate(badge);
      badge.number = undefined;
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-number')).to.be.false;
    });

    it('should set has-number attribute when number is 0', async () => {
      badge.number = 0;
      await nextUpdate(badge);
      expect(badge.hasAttribute('has-number')).to.be.true;
    });
  });

  describe('has-icon attribute', () => {
    it('should not set has-icon attribute by default', () => {
      expect(badge.hasAttribute('has-icon')).to.be.false;
    });

    it('should toggle has-icon attribute on icon slot content change', async () => {
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
