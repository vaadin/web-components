import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-vertical-layout.js';
import { getComputedCSSPropertyValue } from './helpers.js';

describe('vaadin-vertical-layout', () => {
  describe('basic features', () => {
    let layout, tagName;

    beforeEach(() => {
      layout = fixtureSync('<vaadin-vertical-layout></vaadin-vertical-layout>');
      tagName = layout.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });

    it('should have a box-sizing set to border-box', () => {
      expect(getComputedStyle(layout).boxSizing).to.equal('border-box');
    });
  });

  describe('theme variations', () => {
    let layout, c1, c2, space;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-vertical-layout style="width: 300px; height: 200px;">
          <div id="c1">c1</div>
          <div id="c2">c2</div>
        </vaadin-vertical-layout>
      `);
      c1 = layout.querySelector('#c1');
      c2 = layout.querySelector('#c2');
      space = getComputedCSSPropertyValue(layout, '--lumo-space-m');
    });

    it('should place items next to each other', () => {
      expect(layout.getBoundingClientRect()).to.include({ top: 0, right: 300, bottom: 200, left: 0 });

      const c1Rect = c1.getBoundingClientRect();
      expect(c1Rect).to.include({ top: 0, left: 0 });
      expect(c1Rect.bottom).to.be.closeTo(19, 1);
      expect(c1Rect.right).to.be.closeTo(18, 3);

      const c2Rect = c2.getBoundingClientRect();
      expect(c2Rect.top).to.be.closeTo(19, 1);
      expect(c2Rect.bottom).to.be.closeTo(37, 3);
      expect(c2Rect.right).to.be.closeTo(18, 3);
    });

    it('should not have margin or padding by default', () => {
      const style = getComputedStyle(layout);
      expect(style.getPropertyValue('margin-top')).to.equal('0px');
      expect(style.getPropertyValue('margin-right')).to.equal('0px');
      expect(style.getPropertyValue('margin-bottom')).to.equal('0px');
      expect(style.getPropertyValue('margin-left')).to.equal('0px');
      expect(style.getPropertyValue('padding-top')).to.equal('0px');
      expect(style.getPropertyValue('padding-right')).to.equal('0px');
      expect(style.getPropertyValue('padding-bottom')).to.equal('0px');
      expect(style.getPropertyValue('padding-left')).to.equal('0px');
    });

    it('should support theme="margin"', () => {
      layout.setAttribute('theme', 'margin');
      const style = getComputedStyle(layout);
      expect(style.getPropertyValue('margin-top')).to.equal(space);
      expect(style.getPropertyValue('margin-right')).to.equal(space);
      expect(style.getPropertyValue('margin-bottom')).to.equal(space);
      expect(style.getPropertyValue('margin-left')).to.equal(space);
    });

    it('should support theme="padding"', () => {
      layout.setAttribute('theme', 'padding');
      const style = getComputedStyle(layout);
      expect(style.getPropertyValue('padding-top')).to.equal(space);
      expect(style.getPropertyValue('padding-right')).to.equal(space);
      expect(style.getPropertyValue('padding-bottom')).to.equal(space);
      expect(style.getPropertyValue('padding-left')).to.equal(space);
    });

    it('should support theme="spacing"', () => {
      layout.setAttribute('theme', 'spacing');
      expect(getComputedStyle(layout).rowGap).to.equal(space);
    });
  });

  describe('outer spacing', () => {
    let wrapper, layout;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-vertical-layout>
            <div>Content</div>
          </vaadin-vertical-layout>
        </div>
      `);
      layout = wrapper.firstElementChild;
    });

    it('should not occupy space outside when applying theme="spacing"', () => {
      layout.setAttribute('theme', 'spacing');
      wrapper.style.height = '200px';
      layout.style.minHeight = '200px';
      expect(wrapper.scrollHeight).to.equal(200);
    });
  });
});
