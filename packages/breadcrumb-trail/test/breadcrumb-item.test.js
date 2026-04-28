import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-breadcrumb-item.js';

// The breadcrumb item element is experimental and only registers when the
// feature flag is enabled. Setting the flag here triggers the deferred
// `customElements.define` call registered by `defineCustomElement` during
// module import, so the element becomes available below.
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbTrailComponent = true;

describe('vaadin-breadcrumb-item', () => {
  describe('link variant (path is set)', () => {
    let item;

    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/x">Docs</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should render exactly one [part="link"] descendant in shadow DOM', () => {
      const links = item.shadowRoot.querySelectorAll('[part="link"]');
      expect(links.length).to.equal(1);
    });

    it('should render the [part="link"] wrapper as an <a> element', () => {
      const link = item.shadowRoot.querySelector('[part="link"]');
      expect(link.tagName).to.equal('A');
    });

    it('should set the <a> href so it resolves to "/x"', () => {
      const link = item.shadowRoot.querySelector('[part="link"]');
      // `.href` returns the resolved absolute URL; check the pathname
      // so the assertion is independent of the test runner's origin.
      expect(new URL(link.href).pathname).to.equal('/x');
    });

    it('should not render any [part="nolink"] descendant in shadow DOM', () => {
      const nolinks = item.shadowRoot.querySelectorAll('[part="nolink"]');
      expect(nolinks.length).to.equal(0);
    });

    it('should contain a <span part="label"> inside the link wrapper', () => {
      const link = item.shadowRoot.querySelector('[part="link"]');
      const labels = link.querySelectorAll('[part="label"]');
      expect(labels.length).to.equal(1);
      expect(labels[0].tagName).to.equal('SPAN');
    });

    it('should have a default <slot> as the only child of <span part="label">', () => {
      const label = item.shadowRoot.querySelector('[part="link"] [part="label"]');
      expect(label.children.length).to.equal(1);
      const slot = label.firstElementChild;
      expect(slot.tagName).to.equal('SLOT');
      expect(slot.name).to.equal('');
    });

    it('should contain a <slot name="prefix"> inside the link wrapper', () => {
      const link = item.shadowRoot.querySelector('[part="link"]');
      const prefixSlot = link.querySelector('slot[name="prefix"]');
      expect(prefixSlot).to.be.ok;
    });

    it('should place <slot name="prefix"> before <span part="label"> in the link wrapper', () => {
      const link = item.shadowRoot.querySelector('[part="link"]');
      const prefixSlot = link.querySelector('slot[name="prefix"]');
      const label = link.querySelector('[part="label"]');
      // Node.DOCUMENT_POSITION_FOLLOWING (4) means `label` comes after `prefixSlot`.

      expect(prefixSlot.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).to.be.ok;
    });

    it('should project light-DOM text content into the <span part="label"> via the default slot', () => {
      const slot = item.shadowRoot.querySelector('[part="label"] > slot:not([name])');
      const assigned = slot.assignedNodes({ flatten: true });
      const textNodes = assigned.filter((n) => n.nodeType === Node.TEXT_NODE);
      const text = textNodes
        .map((n) => n.textContent)
        .join('')
        .trim();
      expect(text).to.equal('Docs');
    });
  });

  describe('nolink variant (path is unset)', () => {
    let item;

    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should render exactly one [part="nolink"] descendant in shadow DOM', () => {
      const nolinks = item.shadowRoot.querySelectorAll('[part="nolink"]');
      expect(nolinks.length).to.equal(1);
    });

    it('should render the [part="nolink"] wrapper as a <span> element', () => {
      const nolink = item.shadowRoot.querySelector('[part="nolink"]');
      expect(nolink.tagName).to.equal('SPAN');
    });

    it('should not render any [part="link"] descendant in shadow DOM', () => {
      const links = item.shadowRoot.querySelectorAll('[part="link"]');
      expect(links.length).to.equal(0);
    });

    it('should contain a <span part="label"> inside the nolink wrapper', () => {
      const nolink = item.shadowRoot.querySelector('[part="nolink"]');
      const labels = nolink.querySelectorAll('[part="label"]');
      expect(labels.length).to.equal(1);
      expect(labels[0].tagName).to.equal('SPAN');
    });

    it('should have a default <slot> as the only child of <span part="label">', () => {
      const label = item.shadowRoot.querySelector('[part="nolink"] [part="label"]');
      expect(label.children.length).to.equal(1);
      const slot = label.firstElementChild;
      expect(slot.tagName).to.equal('SLOT');
      expect(slot.name).to.equal('');
    });

    it('should contain a <slot name="prefix"> inside the nolink wrapper', () => {
      const nolink = item.shadowRoot.querySelector('[part="nolink"]');
      const prefixSlot = nolink.querySelector('slot[name="prefix"]');
      expect(prefixSlot).to.be.ok;
    });

    it('should place <slot name="prefix"> before <span part="label"> in the nolink wrapper', () => {
      const nolink = item.shadowRoot.querySelector('[part="nolink"]');
      const prefixSlot = nolink.querySelector('slot[name="prefix"]');
      const label = nolink.querySelector('[part="label"]');

      expect(prefixSlot.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).to.be.ok;
    });

    it('should project light-DOM text content into the <span part="label"> via the default slot', () => {
      const slot = item.shadowRoot.querySelector('[part="label"] > slot:not([name])');
      const assigned = slot.assignedNodes({ flatten: true });
      const textNodes = assigned.filter((n) => n.nodeType === Node.TEXT_NODE);
      const text = textNodes
        .map((n) => n.textContent)
        .join('')
        .trim();
      expect(text).to.equal('Current');
    });
  });

  describe('reactive switching when path changes', () => {
    let item;

    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/x">Item</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should render the link wrapper initially with href resolving to "/x"', () => {
      const links = item.shadowRoot.querySelectorAll('[part="link"]');
      expect(links.length).to.equal(1);
      expect(links[0].tagName).to.equal('A');
      expect(new URL(links[0].href).pathname).to.equal('/x');
    });

    it('should swap from link to nolink when path is cleared, and back to link with the new href when path is reassigned', async () => {
      // Sanity check: starts as link, no nolink.
      expect(item.shadowRoot.querySelectorAll('[part="link"]').length).to.equal(1);
      expect(item.shadowRoot.querySelectorAll('[part="nolink"]').length).to.equal(0);

      // Clear the path -> nolink wrapper, no link wrapper.
      item.path = null;
      await nextRender();
      const linksAfterClear = item.shadowRoot.querySelectorAll('[part="link"]');
      const nolinksAfterClear = item.shadowRoot.querySelectorAll('[part="nolink"]');
      expect(linksAfterClear.length).to.equal(0);
      expect(nolinksAfterClear.length).to.equal(1);
      expect(nolinksAfterClear[0].tagName).to.equal('SPAN');

      // Reassign path -> link wrapper restored with new href, no nolink wrapper.
      item.path = '/y';
      await nextRender();
      const linksAfterReassign = item.shadowRoot.querySelectorAll('[part="link"]');
      const nolinksAfterReassign = item.shadowRoot.querySelectorAll('[part="nolink"]');
      expect(linksAfterReassign.length).to.equal(1);
      expect(nolinksAfterReassign.length).to.equal(0);
      expect(linksAfterReassign[0].tagName).to.equal('A');
      expect(new URL(linksAfterReassign[0].href).pathname).to.equal('/y');
    });
  });
});
