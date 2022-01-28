import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { html as legacyHtml, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html, LitElement } from 'lit';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { DelegateFocusMixin } from '../src/delegate-focus-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'delegate-focus-mixin-polymer-element',
  class extends DelegateFocusMixin(ControllerMixin(PolymerElement)) {
    static get template() {
      return legacyHtml`<slot name="input"></slot>`;
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setFocusElement(input);
        })
      );
    }
  }
);

customElements.define(
  'delegate-focus-mixin-lit-element',
  class extends DelegateFocusMixin(PolylitMixin(LitElement)) {
    render() {
      return html`<slot name="input"></slot>`;
    }

    ready() {
      super.ready();

      this.addController(
        new InputController(this, (input) => {
          this._setFocusElement(input);
        })
      );
    }
  }
);

const runTests = (baseClass) => {
  const tag = `delegate-focus-mixin-${baseClass}-element`;

  const updateComplete = () => (baseClass === 'lit' ? element.updateComplete : Promise.resolve());

  let element, input;

  describe('default', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
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

    it('should propagate disabled property to the input', async () => {
      element.disabled = true;
      await updateComplete();
      expect(input.disabled).to.be.true;

      element.disabled = false;
      await updateComplete();
      expect(input.disabled).to.be.false;
    });

    it('should call blur when disabled is set to true', async () => {
      const spy = sinon.spy(element, 'blur');
      element.disabled = true;
      await updateComplete();
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

    it('should propagate disabled property to the newly added input', async () => {
      element.disabled = true;
      element._setFocusElement(null);
      await updateComplete();
      const target = document.createElement('input');
      element._setFocusElement(target);
      await updateComplete();
      expect(target.disabled).to.be.true;
    });

    it('should override disabled property on the newly added input', async () => {
      element._setFocusElement(null);
      await updateComplete();
      const target = document.createElement('input');
      target.setAttribute('disabled', '');
      element._setFocusElement(target);
      await updateComplete();
      expect(target.disabled).to.be.false;
    });
  });

  describe('events', () => {
    let spy;

    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await updateComplete();
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

      it('should not re-dispatch focus when focusElement is removed', async () => {
        element._setFocusElement(null);
        await updateComplete();
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

      it('should not re-dispatch blur when focusElement is removed', async () => {
        element._setFocusElement(null);
        await updateComplete();
        input.dispatchEvent(new Event('blur'));
        expect(spy.calledOnce).to.be.false;
      });
    });
  });

  describe('autofocus', () => {
    beforeEach(() => {
      element = document.createElement(tag);
      element.autofocus = true;
    });

    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should focus the input when autofocus is set', async () => {
      document.body.appendChild(element);
      await updateComplete();
      const spy = sinon.spy(element.focusElement, 'focus');
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should set focused attribute when autofocus is set', async () => {
      document.body.appendChild(element);
      await updateComplete();
      await nextFrame();
      expect(element.hasAttribute('focused')).to.be.true;
    });

    it('should set focus-ring attribute when autofocus is set', async () => {
      document.body.appendChild(element);
      await updateComplete();
      await nextFrame();
      expect(element.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not focus the input when disabled is set', async () => {
      element.disabled = true;
      document.body.appendChild(element);
      await updateComplete();
      const spy = sinon.spy(element.focusElement, 'focus');
      await nextFrame();
      expect(spy.called).to.be.false;
    });

    it('should not set focused attribute when disabled is set', async () => {
      element.disabled = true;
      document.body.appendChild(element);
      await updateComplete();
      await nextFrame();
      expect(element.hasAttribute('focused')).to.be.false;
    });

    it('should not set focus-ring attribute when disabled is set', async () => {
      element.disabled = true;
      document.body.appendChild(element);
      await updateComplete();
      await nextFrame();
      expect(element.hasAttribute('focus-ring')).to.be.false;
    });
  });

  describe('tabindex', () => {
    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await updateComplete();
        input = element.querySelector('input');
      });

      it('should forward tabindex set using property to the input', async () => {
        element.tabIndex = -1;
        await updateComplete();
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should forward tabindex set using attribute to the input', async () => {
        element.setAttribute('tabindex', '-1');
        await updateComplete();
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should set input tabindex to -1 when host element is disabled', async () => {
        element.disabled = true;
        await updateComplete();
        await updateComplete();
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should restore input tabindex when host element is re-enabled', async () => {
        element.disabled = true;
        await updateComplete();
        await updateComplete();

        element.disabled = false;
        await updateComplete();
        await updateComplete();
        expect(input.tabIndex).to.equal(0);
      });

      it('should keep tabindex value changed while element is disabled', async () => {
        element.disabled = true;
        await updateComplete();

        element.setAttribute('tabindex', '1');
        await updateComplete();

        element.disabled = false;
        await updateComplete();
        expect(input.getAttribute('tabindex')).to.equal('1');
      });
    });

    describe('attribute', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} tabindex="-1"></${tag}>`);
        await updateComplete();
        input = element.querySelector('input');
      });

      it('should forward tabindex attribute value to the input', () => {
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should update input tabindex when host attribute changed', async () => {
        element.setAttribute('tabindex', '0');
        await updateComplete();
        expect(input.getAttribute('tabindex')).to.equal('0');
      });

      it('should remove tabindex attribute from the host when changed', async () => {
        element.setAttribute('tabindex', '0');
        await updateComplete();
        expect(element.hasAttribute('tabindex')).to.be.false;
      });
    });
  });
};

describe('DelegateFocusMixin + Polymer', () => {
  runTests('polymer');
});

describe('DelegateFocusMixin + Lit', () => {
  runTests('lit');
});
