import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  aTimeout,
  fixtureSync,
  focusin,
  focusout,
  keyboardEventFor,
  keyDownOn,
  nextFrame
} from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ShadowFocusMixin } from '../src/shadow-focus-mixin.js';

customElements.define(
  'control-state-element',
  class extends ShadowFocusMixin(PolymerElement) {
    static get template() {
      return html`
        <input id="input" />
        <input id="secondInput" />
      `;
    }

    get focusElement() {
      return this.$.input;
    }
  }
);

customElements.define(
  'control-state-wrapper',
  class extends ShadowFocusMixin(PolymerElement) {
    static get template() {
      return html` <control-state-element id="testElement"></control-state-element> `;
    }

    get focusElement() {
      return this.shadowRoot ? this.$.testElement : null;
    }
  }
);

describe('control-state-mixin', () => {
  let customElement, focusElement;

  beforeEach(() => {
    customElement = fixtureSync('<control-state-element></control-state-element>');
    focusElement = customElement.focusElement;
  });

  describe('tabindex', () => {
    it('should forward tabIndex to the internal element', () => {
      customElement.tabIndex = 1;
      expect(focusElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('should se tabindex to 0 by default', () => {
      expect(customElement.getAttribute('tabindex')).to.be.equal('0');
    });

    it('should update the attribute when setting tabIndex', () => {
      customElement.tabIndex = 1;
      expect(customElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('should remove tabindex when setting disabled to true', () => {
      customElement.tabIndex = 1;
      customElement.disabled = true;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;
    });

    it('should restore old tabindex when enabling the element', () => {
      customElement.tabIndex = 1;
      customElement.disabled = true;
      customElement.disabled = false;
      expect(customElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('should restore tabindex when setting disabled to true and then back to false', () => {
      customElement.tabIndex = 2;
      customElement.disabled = true;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;

      customElement.disabled = false;
      expect(customElement.getAttribute('tabindex')).to.be.equal('2');
    });

    it('should apply new tabindex set while element was disabled once it becomes enabled', () => {
      customElement.tabIndex = 2;
      customElement.disabled = true;
      customElement.tabIndex = 3;
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;

      customElement.disabled = false;
      expect(customElement.getAttribute('tabindex')).to.be.equal('3');
    });

    it('should synchronize tabindex with tabIndex', () => {
      customElement.tabindex = 1;
      expect(customElement.tabIndex).to.eql(1);
    });
  });

  describe('focus-ring', () => {
    it('should set _isShiftTabbing when pressing shift-tab', () => {
      const event = keyboardEventFor('keydown', 9, 'shift');
      customElement.dispatchEvent(event);
      expect(customElement._isShiftTabbing).to.be.true;
    });

    it('should skip setting _isShiftTabbing if event is defaultPrevented', () => {
      const evt = keyboardEventFor('keydown', 9, 'shift');
      evt.preventDefault();
      customElement.dispatchEvent(evt);
      expect(customElement._isShiftTabbing).not.to.be.ok;
    });

    it('should set the focus-ring attribute when TAB is pressed and focus is received', () => {
      keyDownOn(document.body, 9);
      focusin(focusElement);
      expect(customElement.hasAttribute('focus-ring')).to.be.true;
      focusout(focusElement);
      expect(customElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should set the focus-ring attribute when SHIFT+TAB is pressed and focus is received', () => {
      keyDownOn(document.body, 9, 'shift');
      focusin(focusElement);
      expect(customElement.hasAttribute('focus-ring')).to.be.true;
      focusout(focusElement);
      expect(customElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should not set the focus-ring attribute when mousedown happens after keydown', () => {
      keyDownOn(document.body, 9);
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      focusin(focusElement);
      expect(customElement.hasAttribute('focus-ring')).to.be.false;
    });

    it('should refocus the field', async () => {
      focusin(customElement);
      keyDownOn(customElement, 9, 'shift');

      // Shift + Tab disables refocusing temporarily, normal behaviour is restored asynchronously.
      await aTimeout(0);
      const spy = sinon.spy(focusElement, 'focus');
      focusin(customElement);
      expect(spy.called).to.be.true;
    });
  });

  describe('disabled', () => {
    let customElement, focusElement;

    beforeEach(() => {
      customElement = fixtureSync('<control-state-element></control-state-element>');
      focusElement = customElement.focusElement;

      customElement.disabled = true;
    });

    it('should not have tabindex if disabled when ready', () => {
      expect(customElement.getAttribute('tabindex')).to.not.be.ok;
    });

    it('should update internal element tabIndex', () => {
      customElement.tabIndex = 4;
      expect(customElement.getAttribute('tabindex')).to.be.null;
      expect(focusElement.getAttribute('tabindex')).to.be.equal('4');
    });

    it('should have aria-disabled attribute set to true when disabled', () => {
      customElement.disabled = true;
      expect(customElement.getAttribute('aria-disabled')).to.be.equal('true');
    });

    it('should not have aria-disabled attribute when is not disabled', () => {
      customElement.disabled = true;
      customElement.disabled = false;
      expect(customElement.getAttribute('aria-disabled')).to.not.be.ok;
    });

    it('should fire click event for element', () => {
      const spy = sinon.spy();
      customElement.disabled = false;
      customElement.addEventListener('click', spy);
      customElement.click();
      expect(spy.called).to.be.true;
    });

    it('should not fire click event for disabled element', () => {
      const spy = sinon.spy();
      customElement.addEventListener('click', spy);
      customElement.click();
      expect(spy.called).to.be.false;
    });
  });

  describe('focus', () => {
    let customElement, focusElement;

    beforeEach(() => {
      customElement = fixtureSync('<control-state-element></control-state-element>');
      focusElement = customElement.focusElement;
    });

    it('should call focus on focusElement', () => {
      const spy = sinon.spy(focusElement, 'focus');
      customElement.focus();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not set focused attribute on host click', () => {
      customElement.click();
      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should set focused attribute on focusin event', () => {
      focusin(focusElement);
      expect(customElement.hasAttribute('focused')).to.be.true;
    });

    it('should not focus if the focus is not received from outside', () => {
      const child = document.createElement('div');
      customElement.appendChild(child);

      focusin(customElement, child);

      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should not set focused attribute on focusin event when disabled', () => {
      customElement.disabled = true;
      focusin(focusElement);
      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should not set focused attribute on focusin event from other focusable element', () => {
      const secondFocusable = focusElement.nextElementSibling;
      focusin(secondFocusable);
      expect(customElement.hasAttribute('focused')).to.be.false;
    });

    it('should not throw an error when using focus() to a newly created method', () => {
      const element = document.createElement('control-state-wrapper');
      expect(() => element.focus()).to.not.throw(Error);
    });

    it('should not throw an error when using blur() to a newly created element', () => {
      const element = document.createElement('control-state-wrapper');
      expect(() => element.blur()).to.not.throw(Error);
    });

    it('should remove focused attribute when disconnected from the DOM', () => {
      focusin(focusElement);
      customElement.parentNode.removeChild(customElement);
      expect(customElement.hasAttribute('focused')).to.be.false;
    });
  });

  describe('event listeners', () => {
    it('should add focusin and focusout listeners before super.ready', (done) => {
      class TestSuperClass extends HTMLElement {
        constructor() {
          super();
          this.addEventListener = sinon.stub();
        }
        ready() {
          this.attachShadow({ mode: 'open' });
          // The listeners should have been added by now
          expect(this.addEventListener.calledWith('focusin')).to.be.true;
          expect(this.addEventListener.calledWith('focusout')).to.be.true;
          done();
        }
      }

      class TestClass extends ShadowFocusMixin(TestSuperClass) {}
      customElements.define('control-state-listeners', TestClass);
      const instance = document.createElement('control-state-listeners');
      instance.ready();
    });
  });

  describe('autofocus', () => {
    beforeEach(() => {
      customElement = fixtureSync('<control-state-element autofocus></control-state-element>');
    });

    it('should have focused and focus-ring set', async () => {
      await nextFrame();
      expect(customElement.hasAttribute('focused')).to.be.true;
      expect(customElement.hasAttribute('focus-ring')).to.be.true;
    });
  });

  describe('nested focusable elements', () => {
    let wrapper, customElement, focusElement;

    beforeEach(() => {
      wrapper = fixtureSync('<control-state-wrapper></control-state-wrapper>');
      customElement = wrapper.focusElement;
      focusElement = customElement.focusElement;
    });

    it('should set focused attribute on focusin event dispatched from an element inside focusElement', () => {
      focusin(focusElement);
      expect(wrapper.hasAttribute('focused')).to.be.true;
    });

    it('should remove focused attribute on focusout event dispatched from an element inside focusElement', () => {
      focusin(focusElement);
      expect(wrapper.hasAttribute('focused')).to.be.true;
      focusout(focusElement);
      expect(wrapper.hasAttribute('focused')).to.be.false;
    });
  });

  describe('focusElement missing', () => {
    beforeEach(() => {
      sinon.stub(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore();
    });

    it('should warn when creating an element without focusElement', () => {
      class ControlStateMissing extends ShadowFocusMixin(PolymerElement) {}
      customElements.define('control-state-missing', ControlStateMissing);
      const instance = document.createElement('control-state-missing');
      expect(instance.focusElement).to.equal(instance);
      expect(console.warn.calledOnce).to.be.true;
    });
  });
});
