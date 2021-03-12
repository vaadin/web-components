import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { keyDownOn, pressAndReleaseKeyOn, pressEnter } from '@polymer/iron-test-helpers/mock-interactions.js';
import { fixture, html } from '@open-wc/testing-helpers';
import { TimePickerElement } from '../vaadin-time-picker.js';

describe('time-picker', () => {
  let timePicker, dropdown, inputElement;

  function changeInputValue(el, value) {
    el.value = value;
    el.dispatchEvent(new CustomEvent('change'));
  }

  beforeEach(async () => {
    timePicker = await fixture(html`<vaadin-time-picker></vaadin-time-picker>`);
    dropdown = timePicker.__dropdownElement;
    inputElement = timePicker.__inputElement;
  });

  describe('custom element', () => {
    it('should have a valid localName', () => {
      expect(timePicker.localName).to.be.equal('vaadin-time-picker');
    });

    it('should be registered in Vaadin namespace', () => {
      expect(TimePickerElement.is).to.be.equal('vaadin-time-picker');
    });

    it('should have a valid version', () => {
      expect(TimePickerElement.version).to.be.ok;
    });
  });

  describe('value', () => {
    it('vaadin-time-picker-text-field should exist', () => {
      expect(inputElement.localName).to.be.equal('vaadin-time-picker-text-field');
    });

    it('value property should be empty by default', () => {
      expect(timePicker.value).to.be.equal('');
    });

    it('should not set value if the format is invalid', () => {
      changeInputValue(dropdown, 'invalid');
      expect(timePicker.value).to.be.equal('');
      expect(dropdown.value).to.be.equal('invalid');
    });

    it('should not allow setting invalid value programmatically', () => {
      timePicker.value = 'invalid';
      expect(timePicker.value).to.be.equal('');
      expect(dropdown.value).to.be.equal('');
    });

    it('should change value to empty string when setting invalid value', () => {
      changeInputValue(dropdown, '09:00');
      changeInputValue(dropdown, 'invalid');
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
      dropdown.value = '12';
      expect(inputElement.value).to.be.equal('12:00');
      dropdown.value = '12';
      expect(inputElement.value).to.be.equal('12:00');
    });

    it('should not restore the previous value in input field if input value is invalid', () => {
      timePicker.value = '12:00';
      timePicker.value = 'invalid';
      expect(timePicker.value).to.be.equal('12:00');
      changeInputValue(dropdown, 'invalid');
      expect(timePicker.value).to.be.equal('');
      expect(dropdown.value).to.be.equal('');
    });

    it('should restore the previous value in input field if input value is empty', () => {
      dropdown.value = '12:00';
      dropdown.value = '';
      expect(timePicker.value).to.be.equal('');
      changeInputValue(dropdown, '');
      expect(timePicker.value).to.be.equal('');
      expect(dropdown.value).to.be.equal('');
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
    ['readonly', 'required', 'disabled', 'preventInvalidInput', 'autofocus'].forEach((prop) => {
      it(`should propagate boolean property to text-field ${prop}`, () => {
        timePicker[prop] = true;
        expect(inputElement[prop]).to.be.true;
        timePicker[prop] = false;
        expect(inputElement[prop]).to.be.false;
      });
    });

    ['label', 'placeholder', 'pattern', 'errorMessage'].forEach((prop) => {
      it(`should propagate string property to text-field ${prop}`, () => {
        expect(inputElement[prop]).to.be.not.ok;
        timePicker[prop] = 'foo';
        expect(inputElement[prop]).to.be.equal('foo');
      });
    });

    // they are used in both combo-box-mixin and text-field
    ['disabled', 'readonly'].forEach((prop) => {
      ['__inputElement', '__dropdownElement'].forEach((elem) => {
        it(`should propagate ${prop} property and attribute to ${elem}`, () => {
          expect(timePicker[elem][prop]).to.be.false;
          expect(timePicker[elem].hasAttribute(prop)).to.be.false;
          timePicker[prop] = true;
          expect(timePicker[elem][prop]).to.be.true;
          expect(timePicker[elem].hasAttribute(prop)).to.be.true;
        });
      });
    });

    it('should reflect to attribute when readonly property is set', () => {
      timePicker.readonly = true;
      expect(timePicker.hasAttribute('readonly')).to.be.true;
    });

    describe('aria', () => {
      it('text-field should have the `aria-label` attribute', () => {
        expect(inputElement.hasAttribute('aria-label')).to.be.false;
        timePicker.label = 'foo';
        expect(inputElement.getAttribute('aria-label')).to.be.equal('foo');
      });

      it('text-field should have the `aria-live` attribute', () => {
        expect(inputElement.getAttribute('aria-live')).to.be.equal('assertive');
      });

      it('clock:icon should have the `aria-label` attribute', () => {
        const icon = timePicker.shadowRoot.querySelector('[part="toggle-button"]');
        expect(icon.getAttribute('aria-label')).to.be.equal(timePicker.i18n.selector);
      });
    });
  });

  describe('clear-button-visible', () => {
    let clearButton;

    beforeEach(() => {
      clearButton = inputElement.$.clearButton;
    });

    it('should propagate clear-button-visible attribute to text-field', () => {
      timePicker.clearButtonVisible = true;
      expect(inputElement).to.have.property('clearButtonVisible', true);
    });

    it('should not show clear button when disabled', () => {
      timePicker.clearButtonVisible = true;
      timePicker.disabled = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should not show clear button when read-only', () => {
      timePicker.clearButtonVisible = true;
      timePicker.readonly = true;
      expect(getComputedStyle(clearButton).display).to.equal('none');
    });

    it('should have default accessible label', function () {
      expect(clearButton.getAttribute('aria-label')).to.equal('Clear');
    });

    it('should translate accessible label with new i18n object', function () {
      const i18n = {};
      Object.assign(i18n, timePicker.i18n);
      i18n.clear = 'tyhjennä';
      timePicker.i18n = i18n;
      expect(clearButton.getAttribute('aria-label')).to.equal('tyhjennä');
    });

    it('should translate accessible label with set API', function () {
      timePicker.set('i18n.clear', 'tyhjennä');
      expect(clearButton.getAttribute('aria-label')).to.equal('tyhjennä');
    });
  });

  describe('change event', () => {
    let spy;

    function arrowUp() {
      pressAndReleaseKeyOn(inputElement, 38);
    }

    function arrowDown() {
      pressAndReleaseKeyOn(inputElement, 40);
    }

    function esc() {
      pressAndReleaseKeyOn(inputElement, 27);
    }

    function enter() {
      pressEnter(inputElement);
    }

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
      enter();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on user arrow input commit', () => {
      arrowDown();
      arrowDown();
      enter();
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on clear button click', () => {
      timePicker.clearButtonVisible = true;
      const clearButton = inputElement.$.clearButton;
      timePicker.value = '00:00';
      clearButton.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true }));
      expect(spy.calledOnce).to.be.true;
    });

    it('should fire change on arrow key when no dropdown opens', () => {
      timePicker.step = 0.5;
      arrowDown();
      expect(spy.calledOnce).to.be.true;
      arrowUp();
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
      dropdown.opened = true;
      inputElement.inputElement.value = '';
      arrowDown();
      enter();
      expect(spy.calledOnce).to.be.true;
      // mimic native change happening on text-field blur
      document.body.click();
      inputElement.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      timePicker.value = '02:00';
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire change if the value was not changed', () => {
      timePicker.value = '01:00';
      dropdown.opened = true;
      enter();
      expect(spy.called).to.be.false;
    });

    it('should not fire change on revert', () => {
      dropdown.opened = true;
      timePicker.value = '01:00';
      esc();
      esc();
      expect(spy.called).to.be.false;
    });
  });
});
