import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fixtureSync, focusin, focusout, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { DelegateFocusMixin } from '../src/delegate-focus-mixin.js';

describe('DelegateFocusMixin', () => {
  let setFocusedSpy;

  const tag = definePolymer(
    'delegate-focus-mixin',
    `
      <slot name="input"></slot>
      <slot name="suffix"></slot>
    `,
    (Base) =>
      class extends DelegateFocusMixin(Base) {
        ready() {
          super.ready();
          const input = this.querySelector('input');
          this._setFocusElement(input);
        }

        _setFocused(focused) {
          super._setFocused(focused);
          setFocusedSpy?.(focused);
        }
      },
  );

  let element, input;

  describe('default', () => {
    let button;

    beforeEach(() => {
      setFocusedSpy = sinon.spy();
      element = fixtureSync(`
        <${tag}>
          <input slot="input" />
          <button slot="suffix"></button>
        </${tag}>
      `);
      input = element.querySelector('input');
      button = element.querySelector('button');
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

    it('should set focus-ring attribute when calling focus() by default', () => {
      element.focus();
      expect(element.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not set focus-ring attribute when calling focus() with focusVisible: false', () => {
      element.focus({ focusVisible: false });
      expect(element.hasAttribute('focus-ring')).to.be.false;
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
      element._setFocusElement(null);
      const target = document.createElement('input');
      element._setFocusElement(target);
      expect(target.disabled).to.be.true;
    });

    it('should override disabled property on the newly added input', () => {
      element._setFocusElement(null);
      const target = document.createElement('input');
      target.setAttribute('disabled', '');
      element._setFocusElement(target);
      expect(target.disabled).to.be.false;
    });

    it('should not invoke setFocused when focusin is not triggered by focusElement', () => {
      focusin(button);
      expect(setFocusedSpy.called).to.be.false;
    });

    it('should not invoke setFocused when focusout is not triggered by focusElement', () => {
      focusout(button);
      expect(setFocusedSpy.called).to.be.false;
    });
  });

  describe('events', () => {
    let spy;

    beforeEach(() => {
      element = fixtureSync(`
        <${tag}>
          <input slot="input" />
        </${tag}>
      `);
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
        element._setFocusElement(null);
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
        element._setFocusElement(null);
        input.dispatchEvent(new Event('blur'));
        expect(spy.calledOnce).to.be.false;
      });
    });
  });

  describe('autofocus', () => {
    beforeEach(() => {
      element = document.createElement(tag);
      element.autofocus = true;

      const input = document.createElement('input');
      input.setAttribute('slot', 'input');
      element.appendChild(input);
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

  describe('tabindex', () => {
    describe('default', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <${tag}>
            <input slot="input" />
          </${tag}>
        `);
        input = element.querySelector('input');
      });

      it('should forward tabindex set using property to the input', () => {
        element.tabIndex = -1;
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should forward tabindex set using attribute to the input', () => {
        element.setAttribute('tabindex', '-1');
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should set input tabindex to -1 when host element is disabled', () => {
        element.disabled = true;
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should restore input tabindex when host element is re-enabled', () => {
        element.disabled = true;
        element.disabled = false;
        expect(input.tabIndex).to.equal(0);
      });

      it('should keep tabindex value changed while element is disabled', () => {
        element.disabled = true;
        element.setAttribute('tabindex', '1');
        element.disabled = false;
        expect(input.getAttribute('tabindex')).to.equal('1');
      });
    });

    describe('attribute', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <${tag} tabindex="-1">
            <input slot="input" />
          </${tag}>
        `);
        input = element.querySelector('input');
      });

      it('should forward tabindex attribute value to the input', () => {
        expect(input.getAttribute('tabindex')).to.equal('-1');
      });

      it('should update input tabindex when host attribute changed', () => {
        element.setAttribute('tabindex', '0');
        expect(input.getAttribute('tabindex')).to.equal('0');
      });

      it('should remove tabindex attribute from the host when changed', () => {
        element.setAttribute('tabindex', '0');
        expect(element.getAttribute('tabindex')).to.equal(null);
      });
    });
  });
});
