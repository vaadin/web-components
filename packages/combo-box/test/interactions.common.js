import { expect } from '@vaadin/chai-plugins';
import {
  aTimeout,
  click,
  escKeyDown,
  fire,
  fixtureSync,
  focusout,
  nextRender,
  nextUpdate,
  outsideClick,
  tabKeyDown,
  tap,
  touchstart,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { getFirstItem, setInputValue } from './helpers.js';

describe('interactions', () => {
  let comboBox, overlay, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box label="Label"></vaadin-combo-box>');
    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
    overlay = comboBox.$.overlay;
  });

  describe('closing', () => {
    beforeEach(() => {
      comboBox.open();
    });

    it('should close overlay on outside click', () => {
      outsideClick();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not close when clicking on the overlay', () => {
      click(overlay);

      expect(comboBox.opened).to.be.true;
    });

    it('should not close when clicking on any overlay children', () => {
      comboBox._scroller.click();

      expect(comboBox.opened).to.be.true;
    });

    it('should close on toggle button click', () => {
      tap(comboBox._toggleElement);

      expect(comboBox.opened).to.be.false;
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

    it('should close the overlay on entering non-existent value', () => {
      // Existent value
      setInputValue(comboBox, 'foo');
      expect(overlay.opened).to.be.true;
      expect(comboBox.opened).to.be.true;

      // Non-existent value
      setInputValue(comboBox, 'qux');
      expect(overlay.opened).to.be.false;
      expect(comboBox.opened).to.be.true;
    });

    it('should not commit non-existent value on overlay closing', () => {
      setInputValue(comboBox, 'qux');
      expect(input.value).to.equal('qux');
      expect(comboBox.value).to.be.empty;

      focusout(input);
      expect(input.value).to.be.empty;
    });
  });

  describe('focus', () => {
    it('should not be focused by default', () => {
      expect(comboBox.hasAttribute('focused')).to.be.false;
    });

    it('should focus the input with focus method', () => {
      comboBox.focus();

      expect(document.activeElement).to.equal(input);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    it('should blur the input with the blur method', () => {
      comboBox.focus();
      comboBox.blur();

      expect(comboBox.hasAttribute('focused')).to.be.false;
      expect(document.activeElement).to.not.equal(input);
    });

    it('should focus the input on required indicator click', () => {
      comboBox.required = true;
      comboBox.shadowRoot.querySelector('[part="required-indicator"]').click();

      expect(comboBox.hasAttribute('focused')).to.be.true;
      expect(document.activeElement).to.equal(input);
    });

    it('should not blur the input on overlay touchstart', () => {
      comboBox.focus();
      comboBox.open();

      const spy = sinon.spy(input, 'blur');
      overlay.dispatchEvent(new CustomEvent('touchstart'));
      expect(spy.callCount).to.eql(0);
    });

    it('should blur the input on overlay touchend', () => {
      comboBox.focus();
      comboBox.open();

      const spy = sinon.spy(input, 'blur');
      overlay.dispatchEvent(new CustomEvent('touchend'));
      expect(spy.callCount).to.eql(1);
    });

    it('should blur the input on overlay touchmove', () => {
      comboBox.focus();
      comboBox.open();

      const spy = sinon.spy(input, 'blur');
      overlay.dispatchEvent(new CustomEvent('touchmove'));
      expect(spy.callCount).to.eql(1);
    });

    it('should prevent default on overlay mousedown', () => {
      const event = fire(overlay, 'mousedown');
      expect(event.defaultPrevented).to.be.true;
    });

    it('should restore focus to the input on outside click', async () => {
      comboBox.focus();
      comboBox.open();
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should restore focus to the input on toggle button click', async () => {
      comboBox.focus();
      comboBox.open();
      comboBox._toggleElement.click();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the input on outside click if not focused before opening', async () => {
      expect(document.activeElement).to.equal(document.body);
      comboBox.open();
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    // NOTE: WebKit incorrectly detects touch environment
    // See https://github.com/vaadin/web-components/issues/257
    (isTouch ? it.skip : it)('should focus the input on opening if not focused', () => {
      const spy = sinon.spy(input, 'focus');
      comboBox.open();

      expect(spy).to.be.calledOnce;
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    (isTouch ? it : it.skip)('should not focus input on dropdown open if not focused', () => {
      const spy = sinon.spy(input, 'focus');
      comboBox.open();

      expect(spy).to.be.not.called;
    });

    (isTouch ? it : it.skip)('should not restore focus to the input on toggle button click', () => {
      const spy = sinon.spy(input, 'focus');
      comboBox.open();
      tap(comboBox._toggleElement);

      expect(spy).to.be.not.called;
    });

    it('should not remove the focused attribute when focusing the scroll bar', () => {
      comboBox.focus();
      comboBox.open();
      focusout(input, overlay);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });

    it('should keep focus-ring attribute after closing with Escape', () => {
      comboBox.focus();
      comboBox.setAttribute('focus-ring', '');
      comboBox.open();
      escKeyDown(input);
      expect(comboBox.hasAttribute('focus-ring')).to.be.true;
    });

    it('should not keep focus-ring attribute after closing with outside click', () => {
      comboBox.focus();
      comboBox.setAttribute('focus-ring', '');
      comboBox.open();
      outsideClick();
      expect(comboBox.hasAttribute('focus-ring')).to.be.false;
      // FIXME: see https://github.com/vaadin/web-components/issues/4148
      // expect(comboBox.hasAttribute('focus-ring')).to.be.true;
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
      comboBox.open();
      comboBox.close();
      await aTimeout(0);
      await sendKeys({ press: 'Tab' });
      expect(input.inputMode).to.equal('');
    });
  });

  describe('clear button', () => {
    let clearButton;

    describe('default', () => {
      it('should not have clear button visible by default', () => {
        expect(comboBox.clearButtonVisible).to.be.false;
      });

      it('should reflect clear-button-visible property to attribute', async () => {
        comboBox.clearButtonVisible = true;
        await nextUpdate(comboBox);
        expect(comboBox.hasAttribute('clear-button-visible')).to.be.true;
      });
    });

    describe('visible', () => {
      beforeEach(async () => {
        comboBox.clearButtonVisible = true;
        comboBox.value = 'foo';
        await nextUpdate(comboBox);
        clearButton = comboBox.$.clearButton;
      });

      it('should show clear button only when value property is set', () => {
        expect(getComputedStyle(clearButton).display).to.equal('block');

        comboBox.value = '';
        expect(getComputedStyle(clearButton).display).to.equal('none');
      });

      it('should not show clear button should when disabled', async () => {
        comboBox.disabled = true;
        await nextUpdate(comboBox);
        expect(getComputedStyle(clearButton).display).to.equal('none');
      });

      it('should not show clear button when readonly', async () => {
        comboBox.readonly = true;
        await nextUpdate(comboBox);
        expect(getComputedStyle(clearButton).display).to.equal('none');
      });

      it('should clear the value on clear button click', () => {
        comboBox.open();

        clearButton.click();

        expect(comboBox.value).to.eql('');
        expect(comboBox._scroller.selectedItem).to.be.null;
        expect(comboBox.selectedItem).to.be.null;
      });

      it('should not open the overlay on clear button click', () => {
        clearButton.click();

        expect(comboBox.opened).to.be.false;
      });

      it('should not close the overlay on clear button click', () => {
        comboBox.open();

        clearButton.click();

        expect(comboBox.opened).to.be.true;
      });

      it('should de-select dropdown item on clear button click', () => {
        comboBox.open();

        const item = getFirstItem(comboBox);
        expect(item.hasAttribute('selected')).to.be.true;

        clearButton.click();
        expect(item.hasAttribute('selected')).to.be.false;
      });

      it('should prevent mousedown event to avoid input blur', () => {
        comboBox.open();

        const event = new CustomEvent('mousedown', { cancelable: true });
        clearButton.dispatchEvent(event);

        expect(event.defaultPrevented).to.be.true;
      });
    });
  });
});
