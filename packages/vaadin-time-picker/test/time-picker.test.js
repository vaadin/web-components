import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { arrowDown, arrowUp, enter, esc, fixtureSync, keyDownOn } from '@vaadin/testing-helpers';
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
    });

    it('should not show clear button when disabled', () => {
      timePicker.clearButtonVisible = true;
      timePicker.disabled = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not show clear button when readonly', () => {
      timePicker.clearButtonVisible = true;
      timePicker.readonly = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });
  });

  describe('change event', () => {
    let spy;

    function inputChar(char) {
      inputElement.value += char;
      keyDownOn(inputElement, char.charCodeAt(0));
      inputElement.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
    }

    function inputText(text) {
      for (var i = 0; i < text.length; i++) {
        inputChar(text[i]);
      }
    }

    beforeEach(() => {
      spy = sinon.spy();
      timePicker.addEventListener('change', spy);
    });

    it('should fire change on user text input commit', () => {
      inputText('00:00');
      enter(inputElement);
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

    it('should not fire change on focused time change', () => {
      inputText('00:00');
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
  });
});
