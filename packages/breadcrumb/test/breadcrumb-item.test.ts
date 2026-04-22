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

  describe('prefix slot', () => {
    describe('shadow DOM', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should render a <slot name="prefix"> inside [part="link"] before [part="label"]', () => {
        const link = item.shadowRoot!.querySelector('[part="link"]')!;
        const prefixSlot = link.querySelector('slot[name="prefix"]') as HTMLSlotElement | null;
        expect(prefixSlot).to.exist;

        const label = link.querySelector('[part="label"]')!;
        expect(label).to.exist;

        // The prefix slot must come before the label part inside the link.
        const position = prefixSlot!.compareDocumentPosition(label);
        expect(position & Node.DOCUMENT_POSITION_FOLLOWING).to.be.greaterThan(0);
      });

      it('should also render a <slot name="prefix"> inside the <span> link when no path is set', async () => {
        const noPathItem = fixtureSync('<vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>') as BreadcrumbItem;
        await nextRender();
        const link = noPathItem.shadowRoot!.querySelector('[part="link"]')!;
        expect(link.tagName).to.equal('SPAN');
        const prefixSlot = link.querySelector('slot[name="prefix"]');
        expect(prefixSlot).to.exist;
      });
    });

    describe('has-prefix attribute', () => {
      it('should not have the has-prefix attribute when no prefix content is slotted', async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.false;
      });

      it('should have the has-prefix attribute when prefix content is slotted at upgrade time', async () => {
        item = fixtureSync(
          '<vaadin-breadcrumb-item path="/foo"><span slot="prefix">icon</span>Foo</vaadin-breadcrumb-item>',
        );
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.true;
      });

      it('should set the has-prefix attribute when a prefix-slotted child is added at runtime', async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item>');
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.false;

        const prefix = document.createElement('span');
        prefix.setAttribute('slot', 'prefix');
        prefix.textContent = 'icon';
        item.appendChild(prefix);
        await nextRender();

        expect(item.hasAttribute('has-prefix')).to.be.true;
      });

      it('should remove the has-prefix attribute when the prefix-slotted child is removed', async () => {
        item = fixtureSync(
          '<vaadin-breadcrumb-item path="/foo"><span slot="prefix">icon</span>Foo</vaadin-breadcrumb-item>',
        );
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.true;

        const prefix = item.querySelector('[slot="prefix"]')!;
        prefix.remove();
        await nextRender();

        expect(item.hasAttribute('has-prefix')).to.be.false;
      });

      it('should not set the has-prefix attribute for whitespace-only text children of the prefix slot', async () => {
        // Text nodes are not assignable to a named slot, so this also serves as
        // a regression check that whitespace siblings do not affect the state.
        item = fixtureSync('<vaadin-breadcrumb-item path="/foo">   Foo   </vaadin-breadcrumb-item>');
        await nextRender();
        expect(item.hasAttribute('has-prefix')).to.be.false;
      });
    });
  });

  describe('separator', () => {
    // Helper: returns the x-scale (the `a` component) of the resolved transform
    // matrix on the ::after pseudo-element. Returns null when there is no
    // transform applied.
    function getAfterTransformXScale(el: Element): number | null {
      const value = getComputedStyle(el, '::after').transform;
      if (!value || value === 'none') {
        return null;
      }
      // matrix(a, b, c, d, tx, ty)  -- scaleX(-1) resolves to "matrix(-1, 0, 0, 1, 0, 0)"
      const match = /^matrix\(\s*(-?\d+(?:\.\d+)?)/u.exec(value);
      if (match) {
        return parseFloat(match[1]);
      }
      // Fallback: the user agent may report scaleX(...) literally.
      const scaleMatch = /scaleX\(\s*(-?\d+(?:\.\d+)?)\s*\)/u.exec(value);
      return scaleMatch ? parseFloat(scaleMatch[1]) : null;
    }

    let firstItem: BreadcrumbItem;
    let lastItem: BreadcrumbItem;

    beforeEach(async () => {
      const wrapper = fixtureSync(
        '<div><vaadin-breadcrumb-item path="/foo">Foo</vaadin-breadcrumb-item><vaadin-breadcrumb-item>Bar</vaadin-breadcrumb-item></div>',
      ) as HTMLDivElement;
      await nextRender();
      [firstItem, lastItem] = wrapper.querySelectorAll('vaadin-breadcrumb-item') as NodeListOf<BreadcrumbItem>;
    });

    it('should render a visible ::after pseudo-element on a non-last item', () => {
      const style = getComputedStyle(firstItem, '::after');
      expect(style.display).to.equal('inline-block');
      expect(style.maskImage).to.not.equal('none');
      expect(style.maskImage).to.include('url(');
    });

    it('should hide the ::after pseudo-element on the :last-of-type item', () => {
      expect(getComputedStyle(lastItem, '::after').display).to.equal('none');
    });

    it('should hide the ::after pseudo-element on an item with the current attribute', async () => {
      firstItem.setAttribute('current', '');
      await nextUpdate(firstItem);
      expect(getComputedStyle(firstItem, '::after').display).to.equal('none');
    });

    it('should reflect a custom --vaadin-breadcrumb-separator URL in the ::after mask-image', () => {
      const customUrl =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M0 0h24v24H0z'/></svg>\")";
      firstItem.style.setProperty('--vaadin-breadcrumb-separator', customUrl);
      const maskImage = getComputedStyle(firstItem, '::after').maskImage;
      // The browser normalises url(...) values; check that the inner data URI matches.
      expect(maskImage).to.include('M0 0h24v24H0z');
      // And that the default chevron token is no longer in effect.
      expect(maskImage).to.not.include('m9 18 6-6-6-6');
    });

    it('should flip the ::after horizontally inside a dir="rtl" ancestor', async () => {
      const rtlWrapper = fixtureSync(
        '<div dir="rtl"><vaadin-breadcrumb-item path="/foo">A</vaadin-breadcrumb-item><vaadin-breadcrumb-item>B</vaadin-breadcrumb-item></div>',
      ) as HTMLDivElement;
      await nextRender();
      const rtlFirstItem = rtlWrapper.querySelector('vaadin-breadcrumb-item') as BreadcrumbItem;
      const xScale = getAfterTransformXScale(rtlFirstItem);
      expect(xScale).to.equal(-1);
    });

    it('should not flip the ::after horizontally outside an RTL context', () => {
      // Sanity check that the RTL flip is scoped — the LTR default item has no
      // (or an identity) transform on ::after.
      const xScale = getAfterTransformXScale(firstItem);
      // Either no transform at all, or an identity matrix (xScale === 1).
      expect(xScale === null || xScale === 1).to.be.true;
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
