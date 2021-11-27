import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-scroller.js';

describe('vaadin-scroller', () => {
  let scroller;

  beforeEach(() => {
    scroller = fixtureSync('<vaadin-scroller></vaadin-scroller>');
  });

  describe('focus', () => {
    it('should not add focus-ring to the host on programmatic focus', () => {
      scroller.focus();
      expect(scroller.hasAttribute('focus-ring')).to.be.false;
    });

    it('should add focus-ring to the host on keyboard focus', async () => {
      await sendKeys({ press: 'Tab' });
      expect(scroller.hasAttribute('focus-ring')).to.be.true;
    });

    it('should remove focus-ring when a child node is focused', async () => {
      scroller.appendChild(document.createElement('input'));
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Tab' });
      expect(document.activeElement.localName).to.equal('input');
      expect(scroller.hasAttribute('focus-ring')).to.be.false;
    });
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
