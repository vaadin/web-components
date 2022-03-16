import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, focusin, focusout, keyboardEventFor, keyDownOn } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ShadowFocusMixin } from '../src/shadow-focus-mixin.js';

customElements.define(
  'shadow-focus-element',
  class extends ShadowFocusMixin(PolymerElement) {
    static get template() {
      return html`
        <input id="input" />
        <input id="secondInput" />
        <slot></slot>
      `;
    }

    get focusElement() {
      return this.$.input;
    }
  }
);

customElements.define(
  'shadow-focus-wrapper',
  class extends ShadowFocusMixin(PolymerElement) {
    static get template() {
      return html`<shadow-focus-element id="testElement"></shadow-focus-element>`;
    }

    get focusElement() {
      return this.shadowRoot ? this.$.testElement : null;
    }
  }
);

describe('shadow-focus-mixin', () => {
  let customElement, focusElement;

  beforeEach(() => {
    customElement = fixtureSync('<shadow-focus-element></shadow-focus-element>');
    focusElement = customElement.focusElement;
  });

  describe('tabindex', () => {
    it('should forward tabIndex to the internal element', () => {
      customElement.tabIndex = 1;
      expect(focusElement.getAttribute('tabindex')).to.be.equal('1');
    });

    it('should set tabindex to 0 by default', () => {
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
    beforeEach(() => {
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
    afterEach(async () => {
      await resetMouse();
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

    it('should delegate focus if the focus is received from outside using keyboard navigation', async () => {
      document.body.focus();
      const spy = sinon.spy(focusElement, 'focus');
      await sendKeys({ press: 'Tab' });
      expect(spy.called).to.be.true;
    });

    it('should not delegate focus when clicking on non-focusable child', async () => {
      const span = document.createElement('span');
      span.textContent = 'test';
      customElement.appendChild(span);

      const spy = sinon.spy(focusElement, 'focus');
      // Click center of span child element
      const rect = span.getBoundingClientRect();
      const middleX = Math.floor(rect.x + rect.width / 2);
      const middleY = Math.floor(rect.y + rect.height / 2);
      await sendMouse({ type: 'click', position: [middleX, middleY] });
      // Clicking on some text content should not move focus
      expect(spy.called).to.be.false;
    });

    it('should not delegate focus if the focus is not received from outside', () => {
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
      const element = document.createElement('shadow-focus-wrapper');
      expect(() => element.focus()).to.not.throw(Error);
    });

    it('should not throw an error when using blur() to a newly created element', () => {
      const element = document.createElement('shadow-focus-wrapper');
      expect(() => element.blur()).to.not.throw(Error);
    });

    it('should remove focused attribute when disconnected from the DOM', () => {
      focusin(focusElement);
      customElement.parentNode.removeChild(customElement);
      expect(customElement.hasAttribute('focused')).to.be.false;
    });
  });
});

describe('nested focusable elements', () => {
  let wrapper, customElement, focusElement;

  beforeEach(() => {
    wrapper = fixtureSync('<shadow-focus-wrapper></shadow-focus-wrapper>');
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
