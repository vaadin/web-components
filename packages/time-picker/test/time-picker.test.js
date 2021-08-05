import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { arrowDown, arrowUp, click, enter, esc, fixtureSync, keyDownOn } from '@vaadin/testing-helpers';
import './vaadin-time-picker.js';

describe('time-picker', () => {
  let timePicker, dropdown, inputElement;

  function changeInputValue(el, value) {
    el.value = value;
    el.dispatchEvent(new CustomEvent('change'));
  }

  beforeEach(() => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    dropdown = timePicker.$.dropdown;
    inputElement = timePicker.inputElement;
  });

  describe('custom element', () => {
    it('should be registered in Vaadin namespace', () => {
      expect(customElements.get('vaadin-time-picker')).to.be.ok;
    });

    it('should have a valid version', () => {
      expect(customElements.get('vaadin-time-picker').version).to.be.ok;
    });
  });

  describe('value', () => {
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
    let inputField;

    beforeEach(() => {
      inputField = timePicker.shadowRoot.querySelector('[part="input-field"]');
    });

    it('should propagate name property to the native input', () => {
      timePicker.name = 'foo';
      expect(inputElement.name).to.equal('foo');
    });

    it('should propagate placeholder property to the native input', () => {
      expect(inputElement.placeholder).to.be.not.ok;
      timePicker.placeholder = 'foo';
      expect(inputElement.placeholder).to.be.equal('foo');
    });

    it('should propagate required property to the native input', () => {
      timePicker.required = true;
      expect(inputElement.required).to.be.true;
      timePicker.required = false;
      expect(inputElement.required).to.be.false;
    });

    describe('invalid', () => {
      it('should propagate invalid property to the native input', () => {
        timePicker.invalid = true;
        expect(inputElement.hasAttribute('invalid')).to.be.true;
        timePicker.invalid = false;
        expect(inputElement.hasAttribute('invalid')).to.be.false;
      });

      it('should propagate invalid property to the input container', () => {
        timePicker.invalid = true;
        expect(inputField.invalid).to.be.true;
        timePicker.invalid = false;
        expect(inputField.invalid).to.be.false;
      });
    });

    describe('readonly', () => {
      it('should reflect readonly property to attribute', () => {
        timePicker.readonly = true;
        expect(timePicker.hasAttribute('readonly')).to.be.true;
      });

      it('should propagate readonly property to the native input', () => {
        timePicker.readonly = true;
        expect(inputElement.readOnly).to.be.true;

        timePicker.readonly = false;
        expect(inputElement.readOnly).to.be.false;
      });

      it('should propagate readonly property to the input container', () => {
        timePicker.readonly = true;
        expect(inputField.readonly).to.be.true;

        timePicker.readonly = false;
        expect(inputField.readonly).to.be.false;
      });

      it('should propagate readonly property to the dropdown', () => {
        timePicker.readonly = true;
        expect(dropdown.readonly).to.be.true;

        timePicker.readonly = false;
        expect(dropdown.readonly).to.be.false;
      });
    });

    describe('disabled', () => {
      it('should propagate disabled property to the native input', () => {
        timePicker.disabled = true;
        expect(inputElement.disabled).to.be.true;

        timePicker.disabled = false;
        expect(inputElement.disabled).to.be.false;
      });

      it('should propagate disabled property to the input container', () => {
        timePicker.disabled = true;
        expect(inputField.disabled).to.be.true;

        timePicker.disabled = false;
        expect(inputField.disabled).to.be.false;
      });

      it('should propagate disabled property to the dropdown', () => {
        timePicker.disabled = true;
        expect(dropdown.disabled).to.be.true;

        timePicker.disabled = false;
        expect(dropdown.disabled).to.be.false;
      });
    });

    describe('theme', () => {
      it('should propagate theme attribute to the input container', () => {
        timePicker.setAttribute('theme', 'foo');
        expect(inputField.getAttribute('theme')).to.equal('foo');
      });

      it('should propagate theme attribute to the dropdown', () => {
        timePicker.setAttribute('theme', 'foo');
        expect(dropdown.getAttribute('theme')).to.equal('foo');
      });
    });
  });

  describe('clear-button-visible', () => {
    let clearButton;

    beforeEach(() => {
      clearButton = timePicker.$.clearButton;
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
      const clearButton = timePicker.$.clearButton;
      timePicker.value = '00:00';
      click(clearButton);
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
      dropdown.opened = true;
      inputElement.value = '';
      arrowDown(inputElement);
      enter(inputElement);
      expect(spy.calledOnce).to.be.true;
      // mimic native change happening on native input blur
      document.body.click();
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      timePicker.value = '02:00';
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire change if the value was not changed', () => {
      timePicker.value = '01:00';
      dropdown.opened = true;
      enter(inputElement);
      expect(spy.called).to.be.false;
    });

    it('should not fire change on revert', () => {
      dropdown.opened = true;
      timePicker.value = '01:00';
      esc(inputElement);
      esc(inputElement);
      expect(spy.called).to.be.false;
    });
  });
});
