import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { DelegateFocusMixin } from '../src/delegate-focus-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'delegate-focus-mixin-element',
  class extends DelegateFocusMixin(ElementMixin(PolymerElement)) {
    static get template() {
      return html`<slot name="input"></slot>`;
    }

    constructor() {
      super();

      this.addController(new InputController(this));
    }
  }
);

describe('delegate-focus-mixin', () => {
  let element, input;

  describe('default', () => {
    beforeEach(() => {
      element = fixtureSync(`<delegate-focus-mixin-element></delegate-focus-mixin-element>`);
      input = element.querySelector('input');
    });

    it('should focus the input on focus call', () => {
      const spy = sinon.spy(input, 'focus');
      element.focus();
      expect(spy.calledOnce).to.be.true;
    });

    it('should set focused attribute on focus call', () => {
      element.focus();
      expect(element.hasAttribute('focused')).to.be.true;
    });

    it('should blur the input on blur call', () => {
      const spy = sinon.spy(input, 'blur');
      element.focus();
      element.blur();
      expect(spy.calledOnce).to.be.true;
    });

    it('should remove focused attribute on blur call', () => {
      element.focus();
      element.blur();
      expect(element.hasAttribute('focused')).to.be.false;
    });

    it('should not focus the input on focus when disabled', () => {
      const spy = sinon.spy(input, 'focus');
      element.disabled = true;
      element.focus();
      expect(spy.calledOnce).to.be.false;
    });

    it('should not set focused attribute when disabled', () => {
      element.disabled = true;
      element.focus();
      expect(element.hasAttribute('focused')).to.be.false;
    });

    it('should propagate disabled property to the input', () => {
      element.disabled = true;
      expect(input.disabled).to.be.true;

      element.disabled = false;
      expect(input.disabled).to.be.false;
    });

    it('should call blur when disabled is set to true', () => {
      const spy = sinon.spy(element, 'blur');
      element.disabled = true;
      expect(spy.calledOnce).to.be.true;
    });

    it('should click the input on click call', () => {
      const spy = sinon.spy(input, 'click');
      element.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not click the input on click when disabled', () => {
      const spy = sinon.spy(input, 'click');
      element.disabled = true;
      element.click();
      expect(spy.calledOnce).to.be.false;
    });

    it('should propagate disabled property to the newly added input', () => {
      element.disabled = true;
      element.focusElement = null;
      const target = document.createElement('input');
      element.focusElement = target;
      expect(target.disabled).to.be.true;
    });

    it('should override disabled property on the newly added input', () => {
      element.focusElement = null;
      const target = document.createElement('input');
      target.setAttribute('disabled', '');
      element.focusElement = target;
      expect(target.disabled).to.be.false;
    });
  });

  describe('events', () => {
    let spy;

    beforeEach(() => {
      element = fixtureSync(`<delegate-focus-mixin-element></delegate-focus-mixin-element>`);
      input = element.querySelector('input');
      spy = sinon.spy();
    });

    describe('focus', () => {
      beforeEach(() => {
        element.addEventListener('focus', spy);
      });

      it('should re-dispatch focus event on the host element', () => {
        input.dispatchEvent(new Event('focus'));
        expect(spy.calledOnce).to.be.true;
      });

      it('should not re-dispatch focus when focusElement is removed', () => {
        element.focusElement = null;
        input.dispatchEvent(new Event('focus'));
        expect(spy.calledOnce).to.be.false;
      });
    });

    describe('blur', () => {
      beforeEach(() => {
        element.addEventListener('blur', spy);
      });

      it('should re-dispatch blur event on the host element', () => {
        input.dispatchEvent(new Event('blur'));
        expect(spy.calledOnce).to.be.true;
      });

      it('should not re-dispatch blur when focusElement is removed', () => {
        element.focusElement = null;
        input.dispatchEvent(new Event('blur'));
        expect(spy.calledOnce).to.be.false;
      });
    });
  });

  describe('autofocus', () => {
    beforeEach(() => {
      element = document.createElement('delegate-focus-mixin-element');
      element.autofocus = true;
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should focus the input when autofocus is set', async () => {
      document.body.appendChild(element);
      const spy = sinon.spy(element.focusElement, 'focus');
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should set focused attribute when autofocus is set', async () => {
      document.body.appendChild(element);
      await nextFrame();
      expect(element.hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute when autofocus is set', async () => {
      document.body.appendChild(element);
      await nextFrame();
      expect(element.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not focus the input when disabled is set', async () => {
      element.disabled = true;
      document.body.appendChild(element);
      const spy = sinon.spy(element.focusElement, 'focus');
      await nextFrame();
      expect(spy.called).to.be.false;
    });

    it('should not set focused attribute when disabled is set', async () => {
      element.disabled = true;
      document.body.appendChild(element);
      await nextFrame();
      expect(element.hasAttribute('focused')).to.be.false;
    });

    it('should not set focus-ring attribute when disabled is set', async () => {
      element.disabled = true;
      document.body.appendChild(element);
      await nextFrame();
      expect(element.hasAttribute('focus-ring')).to.be.false;
    });
  });
});
