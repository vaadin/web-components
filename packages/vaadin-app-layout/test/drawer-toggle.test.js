import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn, keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-drawer-toggle.js';

describe('drawer-toggle', () => {
  let toggle;

  beforeEach(() => {
    toggle = fixtureSync('<vaadin-drawer-toggle></vaadin-drawer-toggle>');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = toggle.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('click event', () => {
    describe('default', () => {
      let spy;

      beforeEach(() => {
        spy = sinon.spy();
        toggle.addEventListener('drawer-toggle-click', spy);
      });

      it('should fire "drawer-toggle-click" event on click', () => {
        toggle.click();
        expect(spy.calledOnce).to.be.true;
      });

      it('should fire "drawer-toggle-click" event on Enter', () => {
        keyDownOn(toggle, 13, [], 'Enter');
        keyUpOn(toggle, 13, [], 'Enter');
        expect(spy.calledOnce).to.be.true;
      });

      it('should fire "drawer-toggle-click" event on Space', () => {
        keyDownOn(toggle, 32, [], ' ');
        keyUpOn(toggle, 32, [], ' ');
        expect(spy.calledOnce).to.be.true;
      });
    });

    describe('disabled', () => {
      let spy;

      beforeEach(() => {
        toggle.disabled = true;
        spy = sinon.spy();
        toggle.addEventListener('drawer-toggle-click', spy);
      });

      it('should not fire "drawer-toggle-click" event on click when disabled', () => {
        toggle.click();
        expect(spy.called).to.be.false;
      });

      it('should not fire "drawer-toggle-click" event on Enter when disabled', () => {
        keyDownOn(toggle, 13, [], 'Enter');
        keyUpOn(toggle, 13, [], 'Enter');
        expect(spy.called).to.be.false;
      });

      it('should not fire "drawer-toggle-click" event on Space when disabled', () => {
        keyDownOn(toggle, 32, [], ' ');
        keyUpOn(toggle, 32, [], ' ');
        expect(spy.called).to.be.false;
      });
    });
  });

  describe('aria-label', () => {
    it('should have ariaLabel property set to "Toggle"', () => {
      expect(toggle.ariaLabel).to.equal('Toggle');
    });

    it('should sync ariaLabel property with aria-label attribute', () => {
      toggle.setAttribute('aria-label', 'Label');
      expect(toggle.ariaLabel).to.equal('Label');
    });

    it('should set "aria-label" on the native button', () => {
      const button = toggle.shadowRoot.querySelector('button');
      expect(button.getAttribute('aria-label')).to.equal('Toggle');
    });
  });
});
