import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import '../vaadin-scroller.js';

describe('vaadin-scroller', () => {
  let scroller;

  beforeEach(() => {
    scroller = fixtureSync('<vaadin-scroller></vaadin-scroller>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = scroller.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });

    it('should have a valid version number', () => {
      expect(customElements.get(tagName).version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
    });

    it('should extend ThemableMixin', () => {
      expect(scroller.constructor._includeStyle).to.be.instanceOf(Function);
    });
  });

  describe('scrollDirection', () => {
    it('should reflect scrollDirection to attribute', () => {
      scroller.scrollDirection = 'horizontal';
      expect(scroller.getAttribute('scroll-direction')).to.equal('horizontal');
    });

    it('should have horizontal and vertical scrollbars by default', () => {
      expect(getComputedStyle(scroller).overflowX).to.equal('auto');
      expect(getComputedStyle(scroller).overflowY).to.equal('auto');
    });

    it('should be possible to enable only vertical scrollbars', () => {
      scroller.setAttribute('scroll-direction', 'vertical');
      expect(getComputedStyle(scroller).overflowY).to.equal('auto');
      expect(getComputedStyle(scroller).overflowX).to.equal('hidden');
    });

    it('should be possible to enable only horizontal scrollbars', () => {
      scroller.setAttribute('scroll-direction', 'horizontal');
      expect(getComputedStyle(scroller).overflowX).to.equal('auto');
      expect(getComputedStyle(scroller).overflowY).to.equal('hidden');
    });

    it('should be possible to disable both direction scrollbars', () => {
      scroller.setAttribute('scroll-direction', 'none');
      expect(getComputedStyle(scroller).overflowX).to.equal('hidden');
      expect(getComputedStyle(scroller).overflowY).to.equal('hidden');
    });
  });
});
