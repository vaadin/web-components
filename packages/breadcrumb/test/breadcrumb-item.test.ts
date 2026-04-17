import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';

// Enable experimental feature flag before importing elements
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

import '../src/vaadin-breadcrumb-item.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

describe('breadcrumb-item', () => {
  let item: BreadcrumbItem;

  describe('path property', () => {
    describe('with path set', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should render an anchor with matching href', () => {
        const link = item.shadowRoot!.querySelector('a[part="link"]') as HTMLAnchorElement;
        expect(link).to.be.ok;
        expect(link.getAttribute('href')).to.equal('/home');
      });

      it('should set tabindex to 0 on the anchor', () => {
        const link = item.shadowRoot!.querySelector('a[part="link"]') as HTMLAnchorElement;
        expect(link.getAttribute('tabindex')).to.equal('0');
      });

      it('should reflect has-path attribute', () => {
        expect(item.hasAttribute('has-path')).to.be.true;
      });
    });

    describe('without path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should render an anchor without href', () => {
        const link = item.shadowRoot!.querySelector('a[part="link"]') as HTMLAnchorElement;
        expect(link).to.be.ok;
        expect(link.hasAttribute('href')).to.be.false;
      });

      it('should set tabindex to -1 on the anchor', () => {
        const link = item.shadowRoot!.querySelector('a[part="link"]') as HTMLAnchorElement;
        expect(link.getAttribute('tabindex')).to.equal('-1');
      });

      it('should not have has-path attribute', () => {
        expect(item.hasAttribute('has-path')).to.be.false;
      });
    });

    describe('clearing path', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should remove has-path attribute when path is cleared', async () => {
        expect(item.hasAttribute('has-path')).to.be.true;
        (item as any).path = undefined;
        await nextRender();
        expect(item.hasAttribute('has-path')).to.be.false;
      });
    });
  });

  describe('slots', () => {
    it('should render slotted text content inside the anchor', async () => {
      item = fixtureSync('<vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>');
      await nextRender();
      const link = item.shadowRoot!.querySelector('a[part="link"]') as HTMLAnchorElement;
      const defaultSlot = link.querySelector('slot:not([name])') as HTMLSlotElement;
      expect(defaultSlot).to.be.ok;
      const nodes = defaultSlot.assignedNodes();
      expect(nodes.length).to.be.greaterThan(0);
      expect(nodes[0].textContent).to.equal('Home');
    });

    it('should render prefix slot content before the label', async () => {
      item = fixtureSync(`
        <vaadin-breadcrumb-item>
          <span slot="prefix">icon</span>
          Home
        </vaadin-breadcrumb-item>
      `);
      await nextRender();
      const link = item.shadowRoot!.querySelector('a[part="link"]') as HTMLAnchorElement;
      const slots = link.querySelectorAll('slot');
      // First slot should be the prefix slot, second should be the default slot
      expect(slots.length).to.be.greaterThanOrEqual(2);
      expect(slots[0].getAttribute('name')).to.equal('prefix');
      expect(slots[1].hasAttribute('name')).to.be.false;
    });
  });
});
