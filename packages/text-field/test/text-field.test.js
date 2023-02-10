import { expect } from '@esm-bundle/chai';
import { aTimeout, fire, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-text-field.js';

describe('text-field', () => {
  let textField, input;

  beforeEach(async () => {
    textField = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    await nextRender();
    input = textField.inputElement;
  });

  describe('properties', () => {
    describe('native', () => {
      async function assertAttrCanBeSet(prop, value) {
        textField[prop] = value;
        await nextFrame();

        const attrValue = input.getAttribute(prop);

        if (value === true) {
          expect(attrValue).not.to.be.null;
        } else if (value === false) {
          expect(attrValue).to.be.null;
        } else if (value) {
          expect(attrValue).to.be.equal(String(value));
        }
      }

      ['pattern', 'placeholder', 'value', 'title'].forEach((prop) => {
        it(`should set string property ${prop}`, async () => {
          textField[prop] = 'foo';
          await nextFrame();
          expect(input[prop]).to.be.equal('foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should set boolean property ${prop}`, async () => {
          textField[prop] = true;
          await nextFrame();
          expect(input[prop]).to.be.true;

          textField[prop] = false;
          await nextFrame();
          expect(input[prop]).to.be.false;
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it(`should set numeric attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it(`should set boolean attribute ${prop}`, async () => {
          await assertAttrCanBeSet(prop, true);
          await assertAttrCanBeSet(prop, false);
        });
      });
    });

    describe('clear button', () => {
      it('should set clearButtonVisible to false by default', () => {
        expect(textField.clearButtonVisible).to.be.false;
      });

      it('should clear the value when clear button is clicked', async () => {
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        await nextFrame();
        textField.$.clearButton.click();
        expect(textField.value).not.to.be.ok;
      });

      it('should clear the native input value when clear button is clicked', async () => {
        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        await nextFrame();
        textField.$.clearButton.click();
        expect(input.value).to.equal('');
      });

      it('should dispatch input event when clear button is clicked', async () => {
        const inputSpy = sinon.spy();
        textField.addEventListener('input', inputSpy);

        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        await nextFrame();

        textField.$.clearButton.click();
        expect(inputSpy.calledOnce).to.be.true;
      });

      it('should dispatch change event when clear button is clicked', async () => {
        const changeSpy = sinon.spy();
        textField.addEventListener('change', changeSpy);

        textField.clearButtonVisible = true;
        textField.value = 'Foo';
        await nextFrame();

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
        fire(input, 'input');
        expect(textField.value).to.be.equal('foo');
      });

      it('setting value to undefined should clear the native input value', async () => {
        textField.value = 'foo';
        await nextFrame();

        textField.value = undefined;
        await nextFrame();
        expect(input.value).to.equal('');
      });
    });

    describe('required', () => {
      beforeEach(async () => {
        textField.required = true;
        await nextFrame();
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
  });

  describe('has-value attribute', () => {
    it('should toggle the attribute on value change', async () => {
      textField.value = 'foo';
      await nextFrame();
      expect(textField.hasAttribute('has-value')).to.be.true;

      textField.value = undefined;
      await nextFrame();
      expect(textField.hasAttribute('has-value')).to.be.false;
    });

    it('should not add the attribute when the value is an empty string', async () => {
      textField.value = '';
      await nextFrame();
      expect(textField.hasAttribute('has-value')).to.be.false;
    });

    // User could accidentally set a 0 or false value
    it('should add the attribute when the value is a number', async () => {
      textField.value = 0;
      await nextFrame();
      expect(textField.hasAttribute('has-value')).to.be.true;
    });

    it('should add the attribute when the value is a boolean', async () => {
      textField.value = false;
      await nextFrame();
      expect(textField.hasAttribute('has-value')).to.be.true;
    });
  });

  describe('value property', () => {
    it('should not consider updating the value as user input if the value is not changed', async () => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);

      textField.value = 'foo';
      await nextFrame();
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
    it('should clear the value when clear() is called', async () => {
      textField.value = 'Foo';
      await nextFrame();
      textField.clear();
      expect(textField.value).not.to.be.ok;
    });

    it('should clear the value of native input when clear() is called', async () => {
      textField.value = 'Foo';
      await nextFrame();
      textField.clear();
      expect(input.value).to.equal('');
    });
  });
});
