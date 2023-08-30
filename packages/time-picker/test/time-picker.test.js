import { expect } from '@esm-bundle/chai';
import { enter, fixtureSync, nextFrame, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-time-picker.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { setInputValue } from './helpers.js';

describe('time-picker', () => {
  let timePicker, comboBox, inputElement;

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    comboBox = timePicker.$.comboBox;
    inputElement = timePicker.inputElement;
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = timePicker.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('value', () => {
    it('value property should be empty by default', () => {
      expect(timePicker.value).to.be.equal('');
    });

    it('should not set value if the format is invalid', () => {
      setInputValue(timePicker, 'invalid');
      enter(inputElement);
      expect(timePicker.value).to.be.equal('');
      expect(inputElement.value).to.be.equal('invalid');
    });

    it('should not allow setting invalid value programmatically', () => {
      timePicker.value = 'invalid';
      expect(timePicker.value).to.be.equal('');
      expect(inputElement.value).to.be.equal('');
    });

    it('should change value to empty string when setting invalid value', () => {
      setInputValue(timePicker, '09:00');
      enter(inputElement);
      setInputValue(timePicker, 'invalid');
      enter(inputElement);
      expect(timePicker.value).to.be.equal('');
    });

    it('should not allow setting invalid time value', () => {
      timePicker.value = '90:00';
      expect(timePicker.value).to.be.equal('');
      timePicker.value = '00:70';
      expect(timePicker.value).to.be.equal('');
      timePicker.value = '00:00:999';
      expect(timePicker.value).to.be.equal('');
      timePicker.value = '00:00:00.9999';
      expect(timePicker.value).to.be.equal('');
    });

    it('should propagate value property to the input element', () => {
      timePicker.value = '12:00';
      expect(inputElement.value).to.be.equal('12:00');
    });

    it('should not preserve bad input on value property change', () => {
      setInputValue(timePicker, 'invalid');
      enter(inputElement);
      timePicker.value = '12:00';
      expect(inputElement.value).to.equal('12:00');
    });

    it('should format input value consistently when committing same input value', () => {
      setInputValue(timePicker, '12');
      enter(inputElement);
      expect(inputElement.value).to.be.equal('12:00');

      setInputValue(timePicker, '12');
      enter(inputElement);
      expect(inputElement.value).to.be.equal('12:00');
    });

    it('should preserve invalid input value while resetting value to empty string', () => {
      timePicker.value = '12:00';
      setInputValue(timePicker, 'foo');
      enter(inputElement);
      expect(timePicker.value).to.equal('');
      expect(inputElement.value).to.equal('foo');
    });

    it('should not restore the previous value in input field if input value is invalid', () => {
      timePicker.value = '12:00';
      timePicker.value = 'foo';
      expect(timePicker.value).to.be.equal('12:00');
      setInputValue(timePicker, 'bar');
      enter(inputElement);
      expect(timePicker.value).to.be.equal('');
      expect(inputElement.value).to.be.equal('bar');
    });

    it('should set empty value on outside click after clearing input value', () => {
      timePicker.value = '12:00';
      setInputValue(timePicker, '');
      outsideClick();
      expect(timePicker.value).to.be.equal('');
      expect(inputElement.value).to.be.equal('');
    });

    it('should dispatch value-changed when value changes', () => {
      const spy = sinon.spy();
      timePicker.addEventListener('value-changed', spy);
      timePicker.value = '12:00';
      expect(spy.calledOnce).to.be.true;
    });

    it('should not call value-changed on keystroke input', () => {
      const spy = sinon.spy();
      timePicker.addEventListener('value-changed', spy);
      inputElement.value = '12:00';
      expect(spy.called).to.be.false;
    });

    it('should be possible to update value', () => {
      timePicker.value = '12:00';
      expect(timePicker.value).to.be.equal('12:00');
      timePicker.value = '13:00';
      expect(timePicker.value).to.be.equal('13:00');
    });

    it('should autocomplete the value', () => {
      timePicker.value = '8';
      expect(timePicker.value).to.be.equal('08:00');
      timePicker.step = 0.5;
      timePicker.value = '3:1';
      expect(timePicker.value).to.be.equal('03:01:00.000');
    });

    it('should autocomplete the same value', () => {
      timePicker.value = '8';
      expect(timePicker.value).to.be.equal('08:00');
      timePicker.value = '8';
      expect(timePicker.value).to.be.equal('08:00');
    });

    it('should autocomplete the milliseconds with hundreds precision', () => {
      timePicker.step = 0.5;
      timePicker.value = '01:01:01.1';
      expect(timePicker.value).to.be.equal('01:01:01.100');
    });

    it('should autocomplete the milliseconds with tens precision', () => {
      timePicker.step = 0.5;
      timePicker.value = '01:01:01.01';
      expect(timePicker.value).to.be.equal('01:01:01.010');
    });

    it('should fire only one value-change event', () => {
      const spy = sinon.spy();
      timePicker.addEventListener('value-changed', spy);
      timePicker.value = '12:00';
      expect(spy.callCount).to.equal(1);
      timePicker.value = '';
      expect(spy.callCount).to.equal(2);
    });

    it('should commit user input on Enter', async () => {
      inputElement.focus();
      await sendKeys({ type: '00:00' });
      expect(timePicker.value).to.equal('');
      await sendKeys({ press: 'Enter' });
      expect(timePicker.value).to.equal('00:00');
    });

    it('should clear value with null', () => {
      timePicker.value = '12:00';
      timePicker.value = null;
      expect(timePicker.value).to.equal('');
    });
  });

  describe('toggle overlay', () => {
    let overlay;

    beforeEach(() => {
      overlay = comboBox.shadowRoot.querySelector('vaadin-time-picker-overlay');
    });

    it('should open overlay using open() call', () => {
      timePicker.open();
      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should close overlay using close() call', () => {
      timePicker.open();
      timePicker.close();
      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when disabled', () => {
      timePicker.disabled = true;
      timePicker.open();
      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when readonly', () => {
      comboBox.readonly = true;
      comboBox.open();
      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });
  });

  describe('properties and attributes', () => {
    it('should propagate required property to input', () => {
      timePicker.required = true;
      expect(inputElement.required).to.be.true;

      timePicker.required = false;
      expect(inputElement.required).to.be.false;
    });

    it('should reflect readonly property to attribute', () => {
      timePicker.readonly = true;
      expect(timePicker.hasAttribute('readonly')).to.be.true;
    });
  });

  describe('clear button', () => {
    let clearButton;

    beforeEach(() => {
      clearButton = timePicker.$.clearButton;
      timePicker.clearButtonVisible = true;
    });

    it('should not show clear button when disabled', () => {
      timePicker.disabled = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not show clear button when readonly', () => {
      timePicker.readonly = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not open the dropdown', () => {
      timePicker.value = '00:00';
      clearButton.click();
      expect(comboBox.opened).to.be.false;
    });

    it('should prevent mousedown event to avoid input blur', () => {
      comboBox.open();

      const event = new CustomEvent('mousedown', { cancelable: true });
      clearButton.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });

    it('should propagate clear button to the internal combo-box', () => {
      expect(comboBox.clearButtonVisible).to.be.true;

      timePicker.clearButtonVisible = false;
      expect(comboBox.clearButtonVisible).to.be.false;
    });

    it('should clear value on Escape if clear button is visible', async () => {
      timePicker.value = '00:00';
      inputElement.focus();
      await sendKeys({ press: 'Escape' });
      expect(timePicker.value).to.equal('');
    });
  });

  describe('toggle button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = timePicker.$.toggleButton;
    });

    // WebKit returns true for isTouch in the test envirnoment. This test fails when isTouch == true, which is a correct behavior
    (isTouch ? it.skip : it)('should focus input element on toggle button click', async () => {
      toggleButton.click();
      expect(comboBox.opened).to.be.true;
      expect(document.activeElement).to.equal(inputElement);
    });
  });

  describe('autoselect', () => {
    it('should set autoselect to false by default', () => {
      expect(timePicker.autoselect).to.be.false;
    });

    it('should not select content on focus when autoselect is false', () => {
      const spy = sinon.spy(inputElement, 'select');
      timePicker.value = '2016-07-14';
      inputElement.focus();
      expect(spy.called).to.be.false;
    });

    it('should select content on focus when autoselect is true', () => {
      const spy = sinon.spy(inputElement, 'select');
      timePicker.value = '00:00';
      timePicker.autoselect = true;
      inputElement.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('min and max properties', () => {
    it('min property should be empty by default', () => {
      expect(timePicker.min).to.be.equal('');
    });

    it('max property should be empty by default', () => {
      expect(timePicker.max).to.be.equal('');
    });

    it('should have dropdown items if min nor max is defined', () => {
      expect(timePicker.__dropdownItems.length).to.be.equal(24);
    });

    it('should allow setting valid min property value', () => {
      timePicker.min = '04:00';
      expect(timePicker.__dropdownItems.length).to.be.equal(20);
    });

    it('should allow setting valid max property value', () => {
      timePicker.max = '19:00';
      expect(timePicker.__dropdownItems.length).to.be.equal(20);
    });

    it('should allow setting valid min and max property value', () => {
      timePicker.min = '04:00';
      timePicker.max = '19:00';
      expect(timePicker.__dropdownItems.length).to.be.equal(16);
    });

    it('should allow setting valid min value via attribute', () => {
      timePicker.setAttribute('min', '04:00');
      expect(timePicker.min).to.be.equal('04:00');
    });

    it('should allow setting valid max value via attribute', () => {
      timePicker.setAttribute('max', '19:00');
      expect(timePicker.max).to.be.equal('19:00');
    });

    it('should allow setting valid min and max values via attributes', () => {
      timePicker.setAttribute('min', '04:00');
      timePicker.setAttribute('max', '19:00');
      expect(timePicker.min).to.be.equal('04:00');
      expect(timePicker.max).to.be.equal('19:00');
    });

    it('setting min should not change an empty value', () => {
      timePicker.min = '10:00';
      expect(timePicker.value).to.be.equal('');
    });

    it('setting max should not change an empty value', () => {
      timePicker.max = '10:00';
      expect(timePicker.value).to.be.equal('');
    });
  });

  describe('step property', () => {
    it('step property should be undefined by default', () => {
      expect(timePicker.step).to.be.equal(undefined);
    });

    it('should have dropdown items if step is undefined', () => {
      timePicker.step = undefined;
      expect(timePicker.__dropdownItems.length).to.be.equal(24);
    });

    it('should have dropdown items if step is bigger or equal than 15min', () => {
      timePicker.step = 15 * 60;
      expect(timePicker.__dropdownItems.length).to.be.equal(96);
    });

    it('should not have dropdown items if step is lesser than 15min', () => {
      timePicker.step = 15 * 60 - 1;
      expect(timePicker.__dropdownItems.length).to.be.equal(0);
    });

    it('should allow setting valid step property value', () => {
      timePicker.step = 0.5;
      expect(timePicker.step).to.be.equal(0.5);
    });

    it('should allow setting valid step value via attribute', () => {
      timePicker.setAttribute('step', '0.5');
      expect(timePicker.step).to.be.equal(0.5);
    });

    it('should expand the resolution and value on step change to smaller value', () => {
      timePicker.value = '12:00:00';
      expect(timePicker.value).to.be.equal('12:00');
      timePicker.step = 0.5;
      expect(timePicker.value).to.be.equal('12:00:00.000');
    });

    it('should shrink the resolution and value on step change to bigger value', () => {
      timePicker.value = '12:00:00';
      expect(timePicker.value).to.be.equal('12:00');
      timePicker.step = 3600;
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should be possible to set hours, minutes, seconds and milliseconds with according step', () => {
      // Hours
      timePicker.step = 3600;
      timePicker.value = '12';
      expect(timePicker.value).to.be.equal('12:00');

      // Minutes
      timePicker.step = 60;
      timePicker.value = '12:12';
      expect(timePicker.value).to.be.equal('12:12');

      // Seconds
      timePicker.step = 1;
      timePicker.value = '12:12:12';
      expect(timePicker.value).to.be.equal('12:12:12');

      // Milliseconds
      timePicker.step = 0.5;
      timePicker.value = '12:12:12.100';
      expect(timePicker.value).to.be.equal('12:12:12.100');
    });
  });

  describe('custom functions', () => {
    it('should use custom parser if that exists', () => {
      timePicker.set('i18n.parseTime', sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }));
      timePicker.value = '12';
      expect(timePicker.i18n.parseTime.args[0][0]).to.be.equal('12:00');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should align values of dropdown and input when i18n was reassigned', () => {
      timePicker.value = '12';
      timePicker.set('i18n', {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      });
      expect(comboBox.selectedItem).to.be.deep.equal({ label: '12:00 AM', value: '12:00 AM' });
      expect(comboBox.value).to.be.equal('12:00 AM');
      expect(inputElement.value).to.be.equal('12:00 AM');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should use custom formatter if that exists', () => {
      timePicker.set('i18n', {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      });
      timePicker.value = '12';
      expect(timePicker.value).to.be.equal('12:00');
      expect(comboBox.value).to.be.equal('12:00 AM');
    });

    it('should accept custom time formatter', () => {
      timePicker.set('i18n.formatTime', sinon.stub().returns('1200'));
      const parseTime = sinon.stub();
      parseTime.withArgs('1200').returns({ hours: 12, minutes: 0 });
      timePicker.set('i18n.parseTime', parseTime);
      timePicker.value = '12:00';
      expect(inputElement.value).to.equal('1200');
      expect(timePicker.value).to.equal('12:00');
    });
  });

  describe('helper text', () => {
    it('should set helper text content using helperText property', async () => {
      timePicker.helperText = 'foo';
      await nextFrame();
      expect(timePicker.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });

    it('should display the helper text when slotted helper available', async () => {
      const helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.textContent = 'foo';
      timePicker.appendChild(helper);
      await nextFrame();
      expect(timePicker.querySelector('[slot="helper"]').textContent).to.eql('foo');
    });
  });

  describe('required', () => {
    beforeEach(() => {
      timePicker.required = true;
    });

    it('should focus on required indicator click', () => {
      timePicker.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(timePicker.hasAttribute('focused')).to.be.true;
    });
  });
});
