import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-text-field.js';

describe('text-field', () => {
  let textField, input;

  beforeEach(async () => {
    textField = fixtureSync('<vaadin-text-field></vaadin-text-field>');
    await nextRender();
    input = textField.inputElement;
  });

  describe('properties', () => {
    describe('delegation', () => {
      async function assertAttrCanBeSet(prop, value) {
        textField[prop] = value;
        await nextUpdate(textField);

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
        it(`should delegate ${prop} property to the input`, async () => {
          textField[prop] = 'foo';
          await nextUpdate(textField);
          expect(input[prop]).to.be.equal('foo');
        });
      });

      ['disabled'].forEach((prop) => {
        it(`should delegate ${prop} property to the input`, async () => {
          textField[prop] = true;
          await nextUpdate(textField);
          expect(input[prop]).to.be.true;

          textField[prop] = false;
          await nextUpdate(textField);
          expect(input[prop]).to.be.false;
        });
      });

      ['maxlength', 'minlength'].forEach((prop) => {
        it(`should delegate ${prop} attribute to the input`, async () => {
          await assertAttrCanBeSet(prop, 2);
        });
      });

      ['autocomplete'].forEach((prop) => {
        it(`should delegate ${prop} attribute to the input`, async () => {
          await assertAttrCanBeSet(prop, 'on');
        });
      });

      ['autocapitalize'].forEach((prop) => {
        it(`should delegate ${prop} attribute to the input`, async () => {
          await assertAttrCanBeSet(prop, 'none');
        });
      });

      ['autocomplete', 'autocorrect', 'readonly', 'required'].forEach((prop) => {
        it(`should delegate ${prop} attribute to the input`, async () => {
          await assertAttrCanBeSet(prop, true);
          await assertAttrCanBeSet(prop, false);
        });
      });
    });

    describe('internal', () => {
      it('should store reference to the clear button element', () => {
        expect(textField.clearElement).to.equal(textField.$.clearButton);
      });

      it('should set ariaTarget property to the input element', () => {
        expect(textField.ariaTarget).to.equal(textField.inputElement);
      });

      it('should set focusElement property to the input element', () => {
        expect(textField.focusElement).to.equal(textField.inputElement);
      });
    });

    describe('required', () => {
      beforeEach(async () => {
        textField.required = true;
        await nextUpdate(textField);
      });

      it('should focus on required indicator click', () => {
        textField.shadowRoot.querySelector('[part="required-indicator"]').click();
        expect(textField.hasAttribute('focused')).to.be.true;
      });
    });
  });
});
