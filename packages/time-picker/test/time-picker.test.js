import { expect } from '@esm-bundle/chai';
import { arrowDown, arrowUp, enter, esc, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../vaadin-time-picker.js';

describe('time-picker', () => {
  let timePicker, comboBox, inputElement;

  function changeInputValue(el, value) {
    el.value = value;
    el.dispatchEvent(new CustomEvent('change'));
  }

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
      changeInputValue(comboBox, 'invalid');
      expect(timePicker.value).to.be.equal('');
      expect(comboBox.value).to.be.equal('invalid');
    });

    it('should not allow setting invalid value programmatically', () => {
      timePicker.value = 'invalid';
      expect(timePicker.value).to.be.equal('');
      expect(comboBox.value).to.be.equal('');
    });

    it('should change value to empty string when setting invalid value', () => {
      changeInputValue(comboBox, '09:00');
      changeInputValue(comboBox, 'invalid');
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

    it('should propagate value to the inputElement', () => {
      timePicker.value = '12:00';
      expect(inputElement.value).to.be.equal('12:00');
    });

    it('input value should be constantly formatted on same input', () => {
      comboBox.value = '12';
      expect(inputElement.value).to.be.equal('12:00');
      comboBox.value = '12';
      expect(inputElement.value).to.be.equal('12:00');
    });

    it('should not restore the previous value in input field if input value is invalid', () => {
      timePicker.value = '12:00';
      timePicker.value = 'invalid';
      expect(timePicker.value).to.be.equal('12:00');
      changeInputValue(comboBox, 'invalid');
      expect(timePicker.value).to.be.equal('');
      expect(comboBox.value).to.be.equal('');
    });

    it('should restore the previous value in input field if input value is empty', () => {
      comboBox.value = '12:00';
      comboBox.value = '';
      expect(timePicker.value).to.be.equal('');
      changeInputValue(comboBox, '');
      expect(timePicker.value).to.be.equal('');
      expect(comboBox.value).to.be.equal('');
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

    it('should clear value with null', () => {
      timePicker.value = '12:00';
      timePicker.value = null;
      expect(timePicker.value).to.equal('');
    });
  });

  describe('properties and attributes', () => {
    it('should propagate placeholder property to input', () => {
      expect(inputElement.placeholder).to.be.not.ok;
      timePicker.placeholder = 'foo';
      expect(inputElement.placeholder).to.be.equal('foo');
    });

    it('should propagate required property to input', () => {
      timePicker.required = true;
      expect(inputElement.required).to.be.true;

      timePicker.required = false;
      expect(inputElement.required).to.be.false;
    });

    it('should propagate pattern property to input', () => {
      expect(inputElement.pattern).to.be.not.ok;
      timePicker.pattern = '^1\\d:.*';
      expect(inputElement.pattern).to.be.equal('^1\\d:.*');
    });

    it('should propagate disabled property to combo-box', () => {
      expect(comboBox.disabled).to.be.false;
      timePicker.disabled = true;
      expect(comboBox.disabled).to.be.true;
    });

    it('should propagate disabled property to input', () => {
      expect(inputElement.disabled).to.be.false;
      timePicker.disabled = true;
      expect(inputElement.disabled).to.be.true;
    });

    it('should propagate readonly property to combo-box', () => {
      expect(comboBox.readonly).to.be.false;
      timePicker.readonly = true;
      expect(comboBox.readonly).to.be.true;
    });

    it('should propagate readonly property to input', () => {
      expect(inputElement.readonly).to.be.not.ok;
      timePicker.readonly = true;
      expect(inputElement.readOnly).to.be.true;
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
      timePicker.$.comboBox.open();

      const event = new CustomEvent('mousedown', { cancelable: true });
      clearButton.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
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

  describe('change event', () => {
    let spy;

    beforeEach(() => {
      spy = sinon.spy();
      timePicker.addEventListener('change', spy);
    });

    it('should fire change on user text input commit', async () => {
      inputElement.focus();
      await sendKeys({ type: '00:00' });
      await sendKeys({ press: 'Enter' });
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on user arrow input commit', () => {
      arrowDown(inputElement);
      arrowDown(inputElement);
      enter(inputElement);
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on clear button click', () => {
      timePicker.clearButtonVisible = true;
      timePicker.value = '00:00';
      timePicker.$.clearButton.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on arrow key when no dropdown opens', () => {
      timePicker.step = 0.5;
      arrowDown(inputElement);
      expect(spy.calledOnce).to.be.true;
      arrowUp(inputElement);
      expect(spy.calledTwice).to.be.true;
    });

    it('should not fire change on focused time change', async () => {
      inputElement.focus();
      await sendKeys({ type: '00:00' });
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change', () => {
      timePicker.value = '01:00';
      expect(spy.called).to.be.false;
    });

    it('should not fire change on programmatic value change after manual one', () => {
      timePicker.value = '00:00';
      comboBox.opened = true;
      inputElement.value = '';
      arrowDown(inputElement);
      enter(inputElement);
      expect(spy.calledOnce).to.be.true;
      // mimic native change happening on text-field blur
      document.body.click();
      timePicker.value = '02:00';
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire change if the value was not changed', () => {
      timePicker.value = '01:00';
      comboBox.opened = true;
      enter(inputElement);
      expect(spy.called).to.be.false;
    });

    it('should not fire change on revert', () => {
      comboBox.opened = true;
      timePicker.value = '01:00';
      esc(inputElement);
      esc(inputElement);
      expect(spy.called).to.be.false;
    });

    it('should fire just one change event', async () => {
      timePicker.focus();
      comboBox.opened = true;
      await sendKeys({ type: '0' });
      enter(inputElement);
      inputElement.blur();
      expect(spy.callCount).to.equal(1);
    });

    it('should not change value on input', async () => {
      inputElement.focus();
      await sendKeys({ type: '00:00' });
      expect(timePicker.value).to.equal('');
      await sendKeys({ press: 'Enter' });
      expect(timePicker.value).to.equal('00:00');
    });
  });

  describe('min and max properties', () => {
    it('min property should be 00:00:00.000 by default', () => {
      expect(timePicker.min).to.be.equal('00:00:00.000');
    });

    it('max property should be 23:59:59.999 by default', () => {
      expect(timePicker.max).to.be.equal('23:59:59.999');
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

    it('should not allow setting a value lower than min property value', () => {
      timePicker.value = '02:00';
      timePicker.min = '10:00';
      expect(timePicker.value).to.be.equal('10:00');
    });

    it('should not allow setting a value higher than max property value', () => {
      timePicker.value = '12:00';
      timePicker.max = '10:00';
      expect(timePicker.value).to.be.equal('10:00');
    });

    it('should not allow setting a value lower than min value via attribute', () => {
      timePicker.setAttribute('value', '02:00');
      timePicker.setAttribute('min', '10:00');
      expect(timePicker.value).to.be.equal('10:00');
    });

    it('should not allow setting a value higher than max value via attribute', () => {
      timePicker.setAttribute('value', '19:00');
      timePicker.setAttribute('max', '16:00');
      expect(timePicker.value).to.be.equal('16:00');
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
    it('should use custom parser if that exists', function () {
      timePicker.set('i18n.parseTime', sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }));
      timePicker.value = '12';
      expect(timePicker.i18n.parseTime.args[0][0]).to.be.equal('12:00');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should align values of dropdown and input when i18n was reassigned', function () {
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

    it('should use custom formatter if that exists', function () {
      timePicker.set('i18n', {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      });
      timePicker.value = '12';
      expect(timePicker.value).to.be.equal('12:00');
      expect(comboBox.value).to.be.equal('12:00 AM');
    });

    it('should accept custom time formatter', function () {
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

  describe('theme attribute', () => {
    beforeEach(() => {
      timePicker.setAttribute('theme', 'foo');
    });

    it('should propagate theme attribute to input container', () => {
      const inputField = timePicker.shadowRoot.querySelector('[part="input-field"]');
      expect(inputField.getAttribute('theme')).to.equal('foo');
    });

    it('should propagate theme attribute to combo-box', () => {
      expect(timePicker.$.comboBox.getAttribute('theme')).to.equal('foo');
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
