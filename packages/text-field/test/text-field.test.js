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
      it('should delegate pattern property to the input', async () => {
        textField.pattern = '[A-Z]+';
        await nextUpdate(textField);
        expect(input.pattern).to.be.equal('[A-Z]+');
      });

      it('should delegate minlength property to the input', async () => {
        textField.minlength = 2;
        await nextUpdate(textField);
        expect(input.getAttribute('minlength')).to.be.equal('2');
      });

      it('should delegate maxlength property to the input', async () => {
        textField.maxlength = 2;
        await nextUpdate(textField);
        expect(input.getAttribute('maxlength')).to.be.equal('2');
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
