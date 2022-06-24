import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-field.js';

describe('text-field', () => {
  let textField, input;

  beforeEach(() => {
    textField = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    input = textField.inputElement;
  });

  describe('properties', () => {
    describe('native', () => {
      function assertAttrCanBeSet(prop, value) {
        textField[prop] = value;
        const attrValue = input.getAttribute(prop);

        if (value === true) {
          expect(attrValue).not.to.be.null;
        } else if (value === false) {
          expect(attrValue).to.be.null;
        } else if (value) {
          expect(attrValue).to.be.equal(String(value));
        }
      }

      function assertPropCanBeSet(prop, value) {
        for (let i = 0; i < 3; i++) {
          // Check different values (i.e. true false true for boolean or string1 string2 string3)
          const newValue = typeof value === 'boolean' ? i % 2 === 0 : value + i;
          textField[prop] = newValue;
          expect(input[prop]).to.be.equal(newValue);
        }
      }

      ['pattern', 'placeholder', 'value', 'title'].forEach((prop) => {
        it(`should set string property ${prop}`, () => {
          assertPropCanBeSet(prop, 'foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should set boolean property ${prop}`, () => {
          assertPropCanBeSet(prop, true);
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it(`should set numeric attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, () => {
          assertAttrCanBeSet(prop, true);
          assertAttrCanBeSet(prop, false);
        });
      });
    });

    describe('clear button', () => {
      it('should set clearButtonVisible to false by default', () => {
        expect(textField.clearButtonVisible).to.be.false;
      });

      it('should clear the value when clear button is clicked', () => {
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        textField.$.clearButton.click();
        expect(textField.value).not.to.be.ok;
      });

      it('should clear the native input value when clear button is clicked', () => {
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        textField.$.clearButton.click();
        expect(input.value).to.equal('');
      });

      it('should dispatch input event when clear button is clicked', () => {
        const inputSpy = sinon.spy();
        textField.addEventListener('input', inputSpy);
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        textField.$.clearButton.click();
        expect(inputSpy.calledOnce).to.be.true;
      });

      it('should dispatch change event when clear button is clicked', () => {
        const changeSpy = sinon.spy();
        textField.addEventListener('change', changeSpy);
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        textField.$.clearButton.click();
        expect(changeSpy.calledOnce).to.be.true;
      });

      it('should prevent default on clear button click', () => {
        const event = new Event('click', { cancelable: true });
        textField.$.clearButton.dispatchEvent(event);
        expect(event.defaultPrevented).to.be.true;
      });
    });

    describe('binding', () => {
      it('default value should be empty string', () => {
        expect(textField.value).to.be.equal('');
      });

      it('setting input value updates value', () => {
        input.value = 'foo';
        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
        expect(textField.value).to.be.equal('foo');
      });

      it('setting value to undefined should clear the native input value', () => {
        textField.value = 'foo';
        textField.value = undefined;
        expect(input.value).to.equal('');
      });
    });

    describe('required', () => {
      beforeEach(() => {
        textField.required = true;
      });

      it('should focus on required indicator click', () => {
        textField.shadowRoot.querySelector('[part="required-indicator"]').click();
        expect(textField.hasAttribute('focused')).to.be.true;
      });
    });

    describe('autoselect', () => {
      it('default value of autoselect should be false', () => {
        expect(textField.autoselect).to.be.false;
      });

      it('should not select content on focus when autoselect is false', async () => {
        textField.value = '123';
        input.dispatchEvent(new CustomEvent('focus', { bubbles: false }));
        await aTimeout(1);
        expect(input.selectionEnd - input.selectionStart).to.equal(0);
      });

      it('should select content on focus when autoselect is true', async () => {
        textField.value = '123';
        textField.autoselect = true;
        input.dispatchEvent(new CustomEvent('focus', { bubbles: false }));
        await aTimeout(1);
        expect(input.selectionEnd - input.selectionStart).to.equal(3);
      });
    });

    describe('validation', () => {
      it('should fire a validated event on validation success', () => {
        const validatedSpy = sinon.spy();
        textField.addEventListener('validated', validatedSpy);
        textField.validate();

        expect(validatedSpy.calledOnce).to.be.true;
        const event = validatedSpy.firstCall.args[0];
        expect(event.detail.valid).to.be.true;
      });

      it('should fire a validated event on validation failure', () => {
        const validatedSpy = sinon.spy();
        textField.addEventListener('validated', validatedSpy);
        textField.required = true;
        textField.validate();

        expect(validatedSpy.calledOnce).to.be.true;
        const event = validatedSpy.firstCall.args[0];
        expect(event.detail.valid).to.be.false;
      });
    });

    describe('validation constraints', () => {
      it('should not validate the field when minlength is set', () => {
        textField.minlength = 2;
        expect(textField.invalid).to.be.false;
      });

      it('should not validate the field when maxlength is set', () => {
        textField.maxlength = 6;
        expect(textField.invalid).to.be.false;
      });

      it('should validate the field when invalid after minlength is changed', () => {
        textField.invalid = true;
        const spy = sinon.spy(textField, 'validate');
        textField.minlength = 2;
        expect(spy.calledOnce).to.be.true;
      });

      it('should validate the field when invalid after maxlength is changed', () => {
        textField.invalid = true;
        const spy = sinon.spy(textField, 'validate');
        textField.maxlength = 6;
        expect(spy.calledOnce).to.be.true;
      });

      it('should update "invalid" state when "required" is removed', () => {
        textField.required = true;
        textField.validate();
        expect(textField.invalid).to.be.true;

        textField.required = false;
        expect(textField.invalid).to.be.false;
      });

      it.skip('should update "invalid" state when "minlength" is removed', () => {
        textField.minlength = 5;
        textField.value = 'foo';

        // There seems to be no way to make minlength/maxlength trigger invalid
        // state in a native input programmatically. It can only become invalid
        // if the user really types into the input. Using MockInteractions,
        // triggering `input` and/or `change` events didn't seem to help.
        // Since vaadin-text-field currently relies on inputElement.checkValidity()
        // for setting the `invalid` property (thus simulating native behaviour)
        // there is currently no way to test this.

        // Let's enable this test if we find a way to make this invalid first

        textField.validate();
        expect(textField.invalid).to.be.true; // Fails here

        textField.minlength = undefined;
        expect(textField.invalid).to.be.false;
      });

      it.skip('should update "invalid" state when "maxlength" is removed', () => {
        textField.maxlength = 3;
        textField.value = 'foobar';

        // There seems to be no way to make minlength/maxlength trigger invalid
        // state in a native input programmatically. It can only become invalid
        // if the user really types into the input. Using MockInteractions,
        // triggering `input` and/or `change` events didn't seem to help.
        // Since vaadin-text-field currently relies on inputElement.checkValidity()
        // for setting the `invalid` property (thus simulating native behaviour)
        // there is currently no way to test this.

        // Let's enable this test if we find a way to make this invalid first

        textField.validate();
        expect(textField.invalid).to.be.true; // Fails here

        textField.maxlength = undefined;
        expect(textField.invalid).to.be.false;
      });

      it('should update "invalid" state when "pattern" is removed', () => {
        textField.value = '123foo';
        textField.pattern = '\\d+';
        textField.validate();
        expect(textField.invalid).to.be.true;

        textField.pattern = '';
        expect(textField.invalid).to.be.false;
      });

      it('should update "invalid" state when a constraint is removed even while other constraints are still active', () => {
        textField.required = true;
        textField.pattern = '\\d*';
        textField.validate();
        expect(textField.invalid).to.be.true;

        textField.required = false;
        expect(textField.invalid).to.be.false;
      });
    });
  });

  describe('has-value attribute', () => {
    it('should toggle the attribute on value change', () => {
      textField.value = 'foo';
      expect(textField.hasAttribute('has-value')).to.be.true;
      textField.value = undefined;
      expect(textField.hasAttribute('has-value')).to.be.false;
    });

    it('should not add the attribute when the value is an empty string', () => {
      textField.value = '';
      expect(textField.hasAttribute('has-value')).to.be.false;
    });

    // User could accidentally set a 0 or false value
    it('should add the attribute when the value is a number', () => {
      textField.value = 0;
      expect(textField.hasAttribute('has-value')).to.be.true;
    });

    it('should add the attribute when the value is a boolean', () => {
      textField.value = false;
      expect(textField.hasAttribute('has-value')).to.be.true;
    });
  });

  describe('value property', () => {
    it('should not consider updating the value as user input if the value is not changed', () => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);

      textField.value = 'foo';
      expect(input.value).to.equal('foo');
    });
  });

  describe('events', () => {
    it('should not stop native input events', () => {
      const inputSpy = sinon.spy();
      textField.addEventListener('input', inputSpy);

      const inputEvent = new Event('input', { bubbles: true, composed: true });
      input.dispatchEvent(inputEvent);

      expect(inputSpy.calledOnce).to.be.true;
      expect(inputSpy.calledWith(inputEvent)).to.be.true;
    });
  });

  describe(`methods`, () => {
    it('should clear the value when clear() is called', () => {
      textField.value = 'Foo';
      textField.clear();
      expect(textField.value).not.to.be.ok;
    });

    it('should clear the value of native input when clear() is called', () => {
      textField.value = 'Foo';
      textField.clear();
      expect(input.value).to.equal('');
    });
  });
});
