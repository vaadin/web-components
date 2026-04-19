import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-breadcrumb-item.js';
import type { BreadcrumbItem } from '../src/vaadin-breadcrumb-item.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

describe('vaadin-breadcrumb-item', () => {
  let item: BreadcrumbItem;

  describe('path property', () => {
    describe('default (no path)', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item>Label</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should default path to null', () => {
        expect(item.path).to.be.null;
      });

      it('should render <a> without href attribute when path is null', () => {
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.hasAttribute('href')).to.be.false;
      });

      it('should have tabindex="-1" on <a> when path is null', () => {
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.getAttribute('tabindex')).to.equal('-1');
      });
    });

    describe('with path set', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item path="/catalog">Label</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should render <a href="/catalog"> when path is set', () => {
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.getAttribute('href')).to.equal('/catalog');
      });

      it('should have tabindex="0" on <a> when path is set', () => {
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.getAttribute('tabindex')).to.equal('0');
      });

      it('should reflect path property to attribute', () => {
        expect(item.getAttribute('path')).to.equal('/catalog');
      });
    });

    describe('dynamic path changes', () => {
      beforeEach(async () => {
        item = fixtureSync('<vaadin-breadcrumb-item>Label</vaadin-breadcrumb-item>');
        await nextRender();
      });

      it('should update href when path is set dynamically', async () => {
        item.path = '/products';
        await nextRender();
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.getAttribute('href')).to.equal('/products');
      });

      it('should remove href when path is set to null', async () => {
        item.path = '/products';
        await nextRender();
        item.path = null;
        await nextRender();
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.hasAttribute('href')).to.be.false;
      });

      it('should update tabindex when path changes', async () => {
        const link = item.shadowRoot!.querySelector('a')!;
        expect(link.getAttribute('tabindex')).to.equal('-1');
        item.path = '/products';
        await nextRender();
        expect(link.getAttribute('tabindex')).to.equal('0');
      });
    });
  });

  describe('prefix slot', () => {
    beforeEach(async () => {
      item = fixtureSync(`
        <vaadin-breadcrumb-item path="/home">
          <span slot="prefix">icon</span>
          Home
        </vaadin-breadcrumb-item>
      `);
      await nextRender();
    });

    it('should have a prefix slot inside the <a> element', () => {
      const link = item.shadowRoot!.querySelector('a')!;
      const prefixSlot = link.querySelector('slot[name="prefix"]');
      expect(prefixSlot).to.be.ok;
    });

    it('should render prefix slot before default slot inside the <a>', () => {
      const link = item.shadowRoot!.querySelector('a')!;
      const slots = link.querySelectorAll('slot');
      expect(slots.length).to.equal(2);
      expect(slots[0].getAttribute('name')).to.equal('prefix');
      expect(slots[1].getAttribute('name')).to.be.null;
    });

    it('should display slotted prefix content', () => {
      const prefixSlot = item.shadowRoot!.querySelector('slot[name="prefix"]') as HTMLSlotElement;
      const assignedNodes = prefixSlot.assignedNodes();
      expect(assignedNodes.length).to.equal(1);
      expect((assignedNodes[0] as HTMLElement).textContent).to.equal('icon');
    });
  });

  describe('prefix slot with vaadin-icon', () => {
    beforeEach(async () => {
      item = fixtureSync(`
        <vaadin-breadcrumb-item path="/home">
          <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
          Home
        </vaadin-breadcrumb-item>
      `);
      await nextRender();
    });

    it('should display a vaadin-icon in the prefix slot', () => {
      const prefixSlot = item.shadowRoot!.querySelector('slot[name="prefix"]') as HTMLSlotElement;
      const assignedNodes = prefixSlot.assignedElements();
      expect(assignedNodes.length).to.equal(1);
      expect(assignedNodes[0].tagName.toLowerCase()).to.equal('vaadin-icon');
    });
  });
});
