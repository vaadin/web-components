import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags!.breadcrumbComponent = true;

await import('../vaadin-breadcrumb-item.js');
import type { BreadcrumbItem } from '../vaadin-breadcrumb-item.js';

describe('vaadin-breadcrumb-item', () => {
  let item: BreadcrumbItem;

  describe('link rendering', () => {
    describe('with path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should render an <a> element with part="link"', () => {
        const link = item.shadowRoot!.querySelector('[part="link"]');
        expect(link).to.exist;
        expect(link!.tagName).to.equal('A');
      });

      it('should set the href on the <a> element to the path value', () => {
        const link = item.shadowRoot!.querySelector('[part="link"]') as HTMLAnchorElement;
        expect(link.getAttribute('href')).to.equal('/foo');
      });

      it('should not render a <span part="link"> when path is set', () => {
        const span = item.shadowRoot!.querySelector('span[part="link"]');
        expect(span).to.be.null;
      });

      it('should add target attribute to the <a> when target is set', async () => {
        item.target = '_blank';
        await nextUpdate(item);
        const link = item.shadowRoot!.querySelector('[part="link"]') as HTMLAnchorElement;
        expect(link.tagName).to.equal('A');
        expect(link.getAttribute('target')).to.equal('_blank');
      });
    });

    describe('without path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should render a <span> element with part="link"', () => {
        const link = item.shadowRoot!.querySelector('[part="link"]');
        expect(link).to.exist;
        expect(link!.tagName).to.equal('SPAN');
      });

      it('should not render an <a> element', () => {
        const anchor = item.shadowRoot!.querySelector('a');
        expect(anchor).to.be.null;
      });
    });

    describe('switching path on and off', () => {
      it('should switch the <span> to an <a> with the new href when path is set after render', async () => {
        item = fixtureSync('<vaadin-breadcrumb-item>Label</vaadin-breadcrumb-item>');
        await nextRender();
        expect(item.shadowRoot!.querySelector('[part="link"]')!.tagName).to.equal('SPAN');

        item.path = '/bar';
        await nextUpdate(item);

        const link = item.shadowRoot!.querySelector('[part="link"]') as HTMLAnchorElement;
        expect(link.tagName).to.equal('A');
        expect(link.getAttribute('href')).to.equal('/bar');
      });
    });
  });

  describe('label part', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should wrap the default slot in a <span part="label">', () => {
      const label = item.shadowRoot!.querySelector('[part="label"]');
      expect(label).to.exist;
      expect(label!.tagName).to.equal('SPAN');
      const slot = label!.querySelector('slot:not([name])') as HTMLSlotElement;
      expect(slot).to.exist;
      const assigned = slot.assignedNodes({ flatten: true });
      const textContent = assigned.map((node) => node.textContent).join('');
      expect(textContent).to.equal('Foo');
    });
  });

  describe('current state attribute', () => {
    describe('with path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should add aria-current="page" to the inner link when current is set on the host', async () => {
        item.setAttribute('current', '');
        await nextUpdate(item);
        const link = item.shadowRoot!.querySelector('[part="link"]')!;
        expect(link.getAttribute('aria-current')).to.equal('page');
      });

      it('should remove aria-current from the inner link when current is removed from the host', async () => {
        item.setAttribute('current', '');
        await nextUpdate(item);
        item.removeAttribute('current');
        await nextUpdate(item);
        const link = item.shadowRoot!.querySelector('[part="link"]')!;
        expect(link.hasAttribute('aria-current')).to.be.false;
      });
    });

    describe('without path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should add aria-current="page" to the inner span when current is set on the host', async () => {
        item.setAttribute('current', '');
        await nextUpdate(item);
        const link = item.shadowRoot!.querySelector('[part="link"]')!;
        expect(link.tagName).to.equal('SPAN');
        expect(link.getAttribute('aria-current')).to.equal('page');
      });

      it('should remove aria-current from the inner span when current is removed from the host', async () => {
        item.setAttribute('current', '');
        await nextUpdate(item);
        item.removeAttribute('current');
        await nextUpdate(item);
        const link = item.shadowRoot!.querySelector('[part="link"]')!;
        expect(link.hasAttribute('aria-current')).to.be.false;
      });
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
      await nextRender();
    });

    it('should set role="listitem" on the host', () => {
      expect(item.getAttribute('role')).to.equal('listitem');
    });

    it('should not override an application-provided role', async () => {
      const customItem = fixtureSync(
        '<vaadin-breadcrumb-item role="treeitem" path="/foo">Foo</vaadin-breadcrumb-item>',
      ) as BreadcrumbItem;
      await nextRender();
      expect(customItem.getAttribute('role')).to.equal('treeitem');
    });
  });
});
