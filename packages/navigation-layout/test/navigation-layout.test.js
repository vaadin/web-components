import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../vaadin-navigation-layout.js';
import '../vaadin-navigation-layout-toggle.js';

describe('vaadin-navigation-layout', () => {
  let layout, toggle;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-navigation-layout>
        <vaadin-navigation-layout-toggle slot="start">Toggle</vaadin-navigation-layout-toggle>
        <div>Content</div>
        <div slot="end">End</div>
      </vaadin-navigation-layout>
    `);
    toggle = layout.querySelector('vaadin-navigation-layout-toggle');
    await nextRender();
  });

  describe('custom element definition', () => {
    it('should have a valid static "is" getter', () => {
      expect(customElements.get('vaadin-navigation-layout').is).to.equal('vaadin-navigation-layout');
      expect(customElements.get('vaadin-navigation-layout-toggle').is).to.equal('vaadin-navigation-layout-toggle');
    });
  });

  describe('slots', () => {
    it('should wrap the start slot with the start part', () => {
      const slot = layout.shadowRoot.querySelector('[part="start"] > slot[name="start"]');
      expect(slot.assignedElements()).to.deep.equal([toggle]);
    });

    it('should wrap the end slot with the end part', () => {
      const slot = layout.shadowRoot.querySelector('[part="end"] > slot[name="end"]');
      expect(slot.assignedElements()).to.deep.equal([layout.querySelector('[slot="end"]')]);
    });

    it('should wrap the default slot with a scroller content part', () => {
      const scroller = layout.shadowRoot.querySelector('[part="content"]');
      expect(scroller.localName).to.equal('vaadin-scroller');
      expect(scroller.querySelector('slot:not([name])')).to.be.ok;
    });
  });

  describe('collapsed', () => {
    it('should toggle collapsed attribute on toggle click', () => {
      toggle.click();
      expect(layout.hasAttribute('collapsed')).to.be.true;
      toggle.click();
      expect(layout.hasAttribute('collapsed')).to.be.false;
    });

    it('should not toggle collapsed attribute when toggle is disabled', () => {
      toggle.disabled = true;
      toggle.click();
      expect(layout.hasAttribute('collapsed')).to.be.false;
    });

    it('should toggle collapsed custom property on collapsed change', () => {
      const content = layout.querySelector(':not([slot])');
      expect(getComputedStyle(content).getPropertyValue('--vaadin-navigation-layout-collapsed')).to.equal('0');
      layout.collapsed = true;
      expect(getComputedStyle(content).getPropertyValue('--vaadin-navigation-layout-collapsed')).to.equal('1');
    });

    it('should only toggle the closest layout when nested', async () => {
      const inner = document.createElement('vaadin-navigation-layout');
      const innerToggle = document.createElement('vaadin-navigation-layout-toggle');
      inner.appendChild(innerToggle);
      layout.appendChild(inner);
      await nextRender();
      innerToggle.click();
      expect(inner.collapsed).to.be.true;
      expect(layout.collapsed).to.be.false;
    });
  });
});
