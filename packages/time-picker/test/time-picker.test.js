import { expect } from '@vaadin/chai-plugins';
import { enter, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-time-picker.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils.js';
import { setInputValue } from './helpers.js';

describe('time-picker', () => {
  let timePicker, inputElement;

  beforeEach(async () => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    await nextRender();
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

    it('should not allow setting invalid value programmatically', () => {
      timePicker.value = 'invalid';
      expect(timePicker.value).to.be.equal('');
      expect(inputElement.value).to.be.equal('');
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

    it('should restore the previous value when setting invalid value', () => {
      timePicker.value = '12:00';
      timePicker.value = 'foo';
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should dispatch value-changed when value changes', () => {
      const spy = sinon.spy();
      timePicker.addEventListener('value-changed', spy);
      timePicker.value = '12:00';
      expect(spy.calledOnce).to.be.true;
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

    it('should clear value with null', () => {
      timePicker.value = '12:00';
      timePicker.value = null;
      expect(timePicker.value).to.equal('');
    });
  });

  describe('properties and attributes', () => {
    it('should propagate required property to input', async () => {
      timePicker.required = true;
      await nextFrame();
      expect(inputElement.required).to.be.true;

      timePicker.required = false;
      await nextFrame();
      expect(inputElement.required).to.be.false;
    });

    it('should reflect readonly property to attribute', async () => {
      timePicker.readonly = true;
      await nextFrame();
      expect(timePicker.hasAttribute('readonly')).to.be.true;
    });
  });

  describe('clear button', () => {
    let clearButton;

    beforeEach(async () => {
      clearButton = timePicker.$.clearButton;
      timePicker.clearButtonVisible = true;
      await nextFrame();
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
      expect(timePicker.opened).to.be.false;
    });

    it('should prevent mousedown event to avoid input blur', () => {
      timePicker.open();

      const event = new CustomEvent('mousedown', { cancelable: true });
      clearButton.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('toggle button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = timePicker.$.toggleButton;
    });

    // WebKit returns true for isTouch in the test envirnoment. This test fails when isTouch == true, which is a correct behavior
    (isTouch ? it.skip : it)('should focus input element on toggle button click', () => {
      toggleButton.click();
      expect(timePicker.opened).to.be.true;
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
      expect(timePicker._dropdownItems.length).to.be.equal(24);
    });

    it('should allow setting valid min property value', () => {
      timePicker.min = '04:00';
      expect(timePicker._dropdownItems.length).to.be.equal(20);
    });

    it('should allow setting valid max property value', () => {
      timePicker.max = '19:00';
      expect(timePicker._dropdownItems.length).to.be.equal(20);
    });

    it('should allow setting valid min and max property value', () => {
      timePicker.min = '04:00';
      timePicker.max = '19:00';
      expect(timePicker._dropdownItems.length).to.be.equal(16);
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
      expect(timePicker._dropdownItems.length).to.be.equal(24);
    });

    it('should have dropdown items if step is bigger or equal than 15min', () => {
      timePicker.step = 15 * 60;
      expect(timePicker._dropdownItems.length).to.be.equal(96);
    });

    it('should not have dropdown items if step is lesser than 15min', () => {
      timePicker.step = 15 * 60 - 1;
      expect(timePicker._dropdownItems.length).to.be.equal(0);
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
      timePicker.i18n = { ...timePicker.i18n, parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }) };
      timePicker.value = '12';
      expect(timePicker.i18n.parseTime.args[0][0]).to.be.equal('12:00');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should align values of dropdown and input when i18n was reassigned', () => {
      timePicker.value = '12';
      timePicker.i18n = {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      };
      expect(inputElement.value).to.be.equal('12:00 AM');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should use custom formatter if that exists', () => {
      timePicker.i18n = {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      };
      timePicker.value = '12';
      expect(timePicker.value).to.be.equal('12:00');
      expect(inputElement.value).to.be.equal('12:00 AM');
    });

    it('should accept custom time formatter', () => {
      timePicker.i18n = {
        formatTime: sinon.stub().returns('1200'),
        parseTime: sinon.stub().withArgs('1200').returns({ hours: 12, minutes: 0 }),
      };
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

  describe('autoOpenDisabled', () => {
    let timePicker, inputElement;

    beforeEach(async () => {
      timePicker = fixtureSync(`<vaadin-time-picker auto-open-disabled value="05:00"></vaadin-time-picker>`);
      await nextRender();
      inputElement = timePicker.inputElement;
    });

    it('should commit a custom value after setting a predefined value', () => {
      setInputValue(timePicker, '05:10');
      enter(inputElement);
      expect(timePicker.value).to.equal('05:10');
    });

    it('should commit an empty value after setting a predefined value', () => {
      setInputValue(timePicker, '');
      enter(inputElement);
      expect(timePicker.value).to.equal('');
    });
  });
});
