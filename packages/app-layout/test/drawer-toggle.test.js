import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, space } from '@vaadin/testing-helpers';
import sinon from 'sinon';
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
        enter(toggle);
        expect(spy.calledOnce).to.be.true;
      });

      it('should fire "drawer-toggle-click" event on Space', () => {
        space(toggle);
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
        enter(toggle);
        expect(spy.called).to.be.false;
      });

      it('should not fire "drawer-toggle-click" event on Space when disabled', () => {
        space(toggle);
        expect(spy.called).to.be.false;
      });
    });
  });

  describe('aria-label', () => {
    it('should set correct aria-label attribute by default', () => {
      expect(toggle.getAttribute('aria-label')).to.equal('Toggle navigation panel');
    });

    it('should reflect ariaLabel property to the attribute', () => {
      toggle.ariaLabel = 'Label';
      expect(toggle.getAttribute('aria-label')).to.equal('Label');
    });
  });

  describe('fallback icon', () => {
    let icon;

    beforeEach(() => {
      icon = toggle.shadowRoot.querySelectorAll('[part="icon"]')[1];
    });

    it('should not show fallback icon by default', () => {
      expect(icon.hasAttribute('hidden')).to.be.true;
    });

    it('should show fallback icon when adding non-empty element', () => {
      const div = document.createElement('div');
      toggle.appendChild(div);
      toggle._observer.flush();
      expect(icon.hasAttribute('hidden')).to.be.true;
    });

    it('should show fallback icon when adding whitespace text node', () => {
      const text = document.createTextNode(' ');
      toggle.appendChild(text);
      toggle._observer.flush();
      expect(icon.hasAttribute('hidden')).to.be.false;
    });

    it('should show fallback icon when adding element to non-default slot', () => {
      // Emulate adding element in HTML wrapped with whitespace text nodes
      toggle.innerHTML = ' <vaadin-tooltip slot="tooltip"></vaadin-tooltip> ';
      toggle._observer.flush();
      expect(icon.hasAttribute('hidden')).to.be.false;
    });

    it('should hide fallback icon when removing whitespace text node', () => {
      const text = document.createTextNode(' ');
      toggle.appendChild(text);
      toggle._observer.flush();

      toggle.removeChild(text);
      toggle._observer.flush();
      expect(icon.hasAttribute('hidden')).to.be.true;
    });

    it('should hide fallback icon when clearing all slotted content', () => {
      // Emulate adding element in HTML wrapped with whitespace text nodes
      toggle.innerHTML = ' <vaadin-tooltip slot="tooltip"></vaadin-tooltip> ';
      toggle._observer.flush();

      toggle.innerHTML = '';
      toggle._observer.flush();
      expect(icon.hasAttribute('hidden')).to.be.true;
    });
  });
});
