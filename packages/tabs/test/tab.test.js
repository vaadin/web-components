import { expect } from '@vaadin/chai-plugins';
import { arrowRight, enter, fixtureSync, nextRender, nextUpdate, space } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-tab.js';

describe('tab', () => {
  let tab;

  beforeEach(async () => {
    tab = fixtureSync('<vaadin-tab>text-content</vaadin-tab>');
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = tab.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('default', () => {
    it('should set role attribute to "tab" on the host', () => {
      expect(tab.getAttribute('role')).to.be.equal('tab');
    });

    it('should have display: none when hidden', () => {
      tab.setAttribute('hidden', '');
      expect(getComputedStyle(tab).display).to.equal('none');
    });
  });

  describe('properties', () => {
    it('should set selected property to false by default', () => {
      expect(tab.selected).to.be.false;
    });

    it('should reflect selected property to attribute', async () => {
      tab.selected = true;
      await nextUpdate(tab);
      expect(tab.hasAttribute('selected')).to.be.true;
    });

    it('should set disabled property to false by default', () => {
      expect(tab.disabled).to.be.false;
    });

    it('should reflect disabled property to attribute', async () => {
      tab.disabled = true;
      await nextUpdate(tab);
      expect(tab.hasAttribute('disabled')).to.be.true;
    });
  });

  describe('slotted anchor', () => {
    let anchor, spy;

    beforeEach(() => {
      anchor = document.createElement('a');
      anchor.textContent = 'Link';
      tab.appendChild(anchor);
      spy = sinon.spy();
      anchor.addEventListener('click', spy);
    });

    it('should propagate click to the anchor element when Enter key pressed', () => {
      enter(tab);
      expect(spy).to.be.calledOnce;
    });

    it('should propagate click to the anchor element when Space key pressed', () => {
      space(tab);
      expect(spy).to.be.calledOnce;
    });

    it('should not propagate click to the anchor when other key pressed', () => {
      arrowRight(tab);
      expect(spy).to.be.not.called;
    });
  });
});
