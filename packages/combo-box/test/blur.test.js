import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import {
  aTimeout,
  escKeyDown,
  fire,
  fixtureSync,
  focusout,
  nextRender,
  tabKeyDown,
  touchstart,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';
import { getFirstItem, setInputValue } from './helpers.js';

describe('blur', () => {
  let comboBox, overlay, input;

  beforeEach(async () => {
    comboBox = fixtureSync(
      `<div>
        <vaadin-combo-box label="Label"></vaadin-combo-box>
        <input id="last-global-focusable" />
      </div>`,
    ).firstElementChild;

    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
    overlay = comboBox.$.overlay;
  });

  describe('blur method', () => {
    it('should blur the input with the blur method', () => {
      comboBox.focus();
      comboBox.blur();

      expect(comboBox.hasAttribute('focused')).to.be.false;
      expect(document.activeElement).to.not.equal(input);
    });
  });

  describe('focus retention', () => {
    afterEach(async () => {
      await resetMouse();
    });

    it('should restore focus to the input on outside click', async () => {
      comboBox.focus();
      comboBox.open();
      await sendMouseToElement({ type: 'click', element: document.body });
      expect(document.activeElement).to.equal(input);
    });

    it('should keep focus in the input on toggle button click', async () => {
      comboBox.focus();
      comboBox.open();
      await sendMouseToElement({ type: 'click', element: comboBox._toggleElement });
      expect(document.activeElement).to.equal(input);
    });

    it('should keep focus-ring attribute after closing with outside click', async () => {
      comboBox.focus();
      comboBox.setAttribute('focus-ring', '');
      comboBox.open();
      await sendMouseToElement({ type: 'click', element: document.body });
      expect(comboBox.hasAttribute('focus-ring')).to.be.true;
    });

    it('should keep focus-ring attribute after closing with Escape', () => {
      comboBox.focus();
      comboBox.setAttribute('focus-ring', '');
      comboBox.open();
      escKeyDown(input);
      expect(comboBox.hasAttribute('focus-ring')).to.be.true;
    });

    it('should keep the input focused when closing on Enter', async () => {
      input.focus();
      comboBox.open();
      await nextRender();
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });

      expect(comboBox.opened).to.be.false;
      expect(document.activeElement).to.equal(input);
    });

    it('should not remove the focused attribute when focusing the scroll bar', () => {
      comboBox.focus();
      comboBox.open();
      focusout(input, overlay);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });
  });

  describe('close on focus loss', () => {
    beforeEach(() => {
      comboBox.open();
    });

    it('should close when focus is lost from keyboard', () => {
      tabKeyDown(input);
      focusout(input);

      expect(comboBox.opened).to.be.false;
    });

    it('should not close when focus is moved to item', () => {
      const item = getFirstItem(comboBox);
      focusout(input, item);

      expect(comboBox.opened).to.be.true;
    });

    it('should not close when focus is moved to overlay', () => {
      focusout(input, overlay);

      expect(comboBox.opened).to.be.true;
    });
  });

  describe('overlay touch', () => {
    it('should not blur the input on overlay touchstart', () => {
      comboBox.focus();
      comboBox.open();

      const spy = sinon.spy(input, 'blur');
      overlay.dispatchEvent(new CustomEvent('touchstart'));
      expect(spy).to.be.not.called;
    });

    it('should blur the input on overlay touchend', () => {
      comboBox.focus();
      comboBox.open();

      const spy = sinon.spy(input, 'blur');
      overlay.dispatchEvent(new CustomEvent('touchend'));
      expect(spy).to.be.calledOnce;
    });

    it('should blur the input on overlay touchmove', () => {
      comboBox.focus();
      comboBox.open();

      const spy = sinon.spy(input, 'blur');
      overlay.dispatchEvent(new CustomEvent('touchmove'));
      expect(spy).to.be.calledOnce;
    });

    it('should prevent default on overlay mousedown', () => {
      const event = fire(overlay, 'mousedown');
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('virtual keyboard', () => {
    it('should disable virtual keyboard on close', () => {
      comboBox.open();
      comboBox.close();
      expect(input.inputMode).to.equal('none');
    });

    it('should re-enable virtual keyboard on touchstart', () => {
      comboBox.open();
      comboBox.close();
      touchstart(comboBox);
      expect(input.inputMode).to.equal('');
    });

    it('should re-enable virtual keyboard on blur', async () => {
      comboBox.focus();
      comboBox.open();
      comboBox.close();
      await aTimeout(0);
      await sendKeys({ press: 'Tab' });
      expect(input.inputMode).to.equal('');
    });
  });

  describe('iOS', () => {
    beforeEach(() => {
      // Mimic iOS so that the real blur-on-close condition is used
      comboBox._ios = true;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should blur the input when closing on outside click', async () => {
      input.focus();
      comboBox.open();
      await nextRender();

      // The outside click alone does not blur: the overlay prevents the mousedown
      // to keep the input focused (see the `_mouseDownListener` override)
      await sendMouseToElement({ type: 'click', element: document.body });
      expect(document.activeElement).to.not.equal(input);
    });

    it('should commit a typed value before the input is blurred', async () => {
      let focusedOnChange;
      comboBox.addEventListener('change', () => {
        focusedOnChange = document.activeElement === input;
      });

      input.focus();
      comboBox.open();
      await nextRender();
      setInputValue(comboBox, 'foo');

      await sendMouseToElement({ type: 'click', element: document.body });
      expect(comboBox.value).to.equal('foo');
      // Wrappers reacting to focusout, such as Grid Pro editors, must see the
      // committed value, so the commit has to happen before the input is blurred
      expect(focusedOnChange).to.be.true;
      expect(document.activeElement).to.not.equal(input);
    });

    it('should not blur the input when it lost focus before the close', async () => {
      const blurSpy = sinon.spy(input, 'blur');

      input.focus();
      comboBox.open();
      await nextRender();

      // Mimic the overlay touch action blurring the input before the close
      comboBox._onOverlayTouchAction();
      blurSpy.resetHistory();

      await sendMouseToElement({ type: 'click', element: document.body });
      expect(blurSpy).to.be.not.called;
    });

    it('should not blur the input when closing on toggle button click', async () => {
      input.focus();
      comboBox.open();
      await nextRender();

      // Blurring would end editing in wrappers such as Grid Pro, where the
      // toggle button is a part of the editor
      await sendMouseToElement({ type: 'click', element: comboBox._toggleElement });
      expect(comboBox.opened).to.be.false;
      expect(document.activeElement).to.equal(input);
    });

    it('should not set the pending autoselect state when blurring', async () => {
      comboBox.autoselect = true;
      input.focus();
      comboBox.open();
      await nextRender();

      await sendMouseToElement({ type: 'click', element: document.body });
      // Autoselect is triggered by the next focus event instead
      expect(comboBox.__autoselectPending).to.not.be.true;
    });

    it('should not commit the value on close while loading', async () => {
      comboBox.loading = true;
      input.focus();
      comboBox.open();
      await nextRender();
      setInputValue(comboBox, 'foo');

      await sendMouseToElement({ type: 'click', element: document.body });
      expect(comboBox.value).to.equal('');
    });
  });
});
