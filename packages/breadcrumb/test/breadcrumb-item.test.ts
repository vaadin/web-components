import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-breadcrumb-item.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb-item', () => {
  let item: BreadcrumbItem;
  let link: HTMLAnchorElement;

  describe('default state (no path)', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
      await nextRender();
      link = item.shadowRoot!.querySelector('a[part="link"]')!;
    });

    it('should render an <a> element with part="link"', () => {
      expect(link).to.be.ok;
      expect(link.localName).to.equal('a');
    });

    it('should not have href when path is undefined', () => {
      expect(link.hasAttribute('href')).to.be.false;
    });

    it('should not have tabindex when path is undefined', () => {
      expect(link.hasAttribute('tabindex')).to.be.false;
    });

    it('should project slot content inside the link element', () => {
      const slot = link.querySelector('slot:not([name])');
      expect(slot).to.be.ok;
    });
  });

  describe('path property', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>');
      await nextRender();
      link = item.shadowRoot!.querySelector('a[part="link"]')!;
    });

    it('should set href on the link when path is set', () => {
      expect(link.getAttribute('href')).to.equal('/home');
    });

    it('should set tabindex="0" on the link when path is set', () => {
      expect(link.getAttribute('tabindex')).to.equal('0');
    });

    it('should update href when path changes', async () => {
      item.path = '/other';
      await nextRender();
      expect(link.getAttribute('href')).to.equal('/other');
    });

    it('should remove href when path is set to undefined', async () => {
      item.path = undefined;
      await nextRender();
      expect(link.hasAttribute('href')).to.be.false;
    });

    it('should remove tabindex when path is set to undefined', async () => {
      item.path = undefined;
      await nextRender();
      expect(link.hasAttribute('tabindex')).to.be.false;
    });
  });

  describe('current property', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>');
      await nextRender();
      link = item.shadowRoot!.querySelector('a[part="link"]')!;
    });

    it('should not have href when current is true', async () => {
      (item as any)._setCurrent(true);
      await nextRender();
      expect(link.hasAttribute('href')).to.be.false;
    });

    it('should not have tabindex when current is true', async () => {
      (item as any)._setCurrent(true);
      await nextRender();
      expect(link.hasAttribute('tabindex')).to.be.false;
    });

    it('should set aria-current="page" when current is true', async () => {
      (item as any)._setCurrent(true);
      await nextRender();
      expect(link.getAttribute('aria-current')).to.equal('page');
    });

    it('should not have aria-current when current is false', () => {
      expect(link.hasAttribute('aria-current')).to.be.false;
    });

    it('should reflect current attribute to the host', async () => {
      (item as any)._setCurrent(true);
      await nextRender();
      expect(item.hasAttribute('current')).to.be.true;
    });

    it('should be read-only (cannot be set directly)', () => {
      (item as any).current = true;
      expect(item.current).to.be.false;
    });

    it('should set current to true via _setCurrent(true)', () => {
      (item as any)._setCurrent(true);
      expect(item.current).to.be.true;
    });

    it('should set current to false via _setCurrent(false)', () => {
      (item as any)._setCurrent(true);
      expect(item.current).to.be.true;
      (item as any)._setCurrent(false);
      expect(item.current).to.be.false;
    });
  });

  describe('disabled property', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/home" disabled>Home</vaadin-breadcrumb-item>');
      await nextRender();
      link = item.shadowRoot!.querySelector('a[part="link"]')!;
    });

    it('should not have href when disabled', () => {
      expect(link.hasAttribute('href')).to.be.false;
    });

    it('should set tabindex="-1" when disabled', () => {
      expect(link.getAttribute('tabindex')).to.equal('-1');
    });

    it('should reflect disabled attribute to the host', () => {
      expect(item.hasAttribute('disabled')).to.be.true;
    });

    it('should set aria-disabled="true" on the host when disabled', () => {
      expect(item.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should restore href when re-enabled', async () => {
      item.disabled = false;
      await nextRender();
      expect(link.getAttribute('href')).to.equal('/home');
    });

    it('should restore tabindex="0" when re-enabled', async () => {
      item.disabled = false;
      await nextRender();
      expect(link.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('state matrix interactions', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>');
      await nextRender();
      link = item.shadowRoot!.querySelector('a[part="link"]')!;
    });

    it('should not have href when both current and disabled are true', async () => {
      (item as any)._setCurrent(true);
      item.disabled = true;
      await nextRender();
      expect(link.hasAttribute('href')).to.be.false;
    });

    it('should have aria-current="page" when current is true regardless of path', async () => {
      item.path = undefined;
      (item as any)._setCurrent(true);
      await nextRender();
      expect(link.getAttribute('aria-current')).to.equal('page');
    });
  });

  describe('separator', () => {
    let separator: HTMLSpanElement;

    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>');
      await nextRender();
      separator = item.shadowRoot!.querySelector('span[part="separator"]')!;
    });

    it('should render a <span part="separator"> before the link', () => {
      expect(separator).to.be.ok;
      expect(separator.localName).to.equal('span');
      // Separator should come before the link in the shadow DOM
      const link = item.shadowRoot!.querySelector('a[part="link"]')!;
      expect(separator.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).to.be.ok;
    });

    it('should contain the default chevron character', () => {
      expect(separator.textContent).to.equal('\u203A');
    });

    it('should have aria-hidden="true"', () => {
      expect(separator.getAttribute('aria-hidden')).to.equal('true');
    });

    it('should replace default chevron when _customSeparator is set with a DOM node', async () => {
      const customNode = document.createElement('span');
      customNode.textContent = '/';
      (item as any)._customSeparator = customNode;
      await nextRender();
      expect(separator.contains(customNode)).to.be.true;
      expect(separator.textContent).to.equal('/');
    });

    it('should restore default chevron when _customSeparator is cleared', async () => {
      const customNode = document.createElement('span');
      customNode.textContent = '/';
      (item as any)._customSeparator = customNode;
      await nextRender();
      expect(separator.textContent).to.equal('/');
      (item as any)._customSeparator = undefined;
      await nextRender();
      expect(separator.textContent).to.equal('\u203A');
    });

    it('should hide separator when the first attribute is set', async () => {
      item.setAttribute('first', '');
      await nextRender();
      expect(getComputedStyle(separator).display).to.equal('none');
    });

    it('should show separator when the first attribute is removed', async () => {
      item.setAttribute('first', '');
      await nextRender();
      expect(getComputedStyle(separator).display).to.equal('none');
      item.removeAttribute('first');
      await nextRender();
      expect(getComputedStyle(separator).display).not.to.equal('none');
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should set role="listitem" on the host', () => {
      expect(item.getAttribute('role')).to.equal('listitem');
    });
  });
});
