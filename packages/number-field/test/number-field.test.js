import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { arrowDown, arrowUp, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-number-field.js';

describe('number-field', () => {
  let numberField;

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      tagName = numberField.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('basic', () => {
    let input;

    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
      input = numberField.inputElement;
    });

    it('should set value with correct decimal places regardless of step', async () => {
      numberField.step = 2;
      numberField.value = 9.99;
      await nextUpdate(numberField);

      expect(numberField.value).equal('9.99');
    });

    it('should increment value on ArrowUp', async () => {
      numberField.step = 3;
      await nextUpdate(numberField);
      arrowUp(input);
      expect(numberField.value).equal('3');
    });

    it('should fire input event on input element when pressing ArrowUp', async () => {
      numberField.step = 3;
      await nextUpdate(numberField);
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      arrowUp(input);
      expect(spy).to.be.calledOnce;
    });

    it('should decrement value on ArrowDown', async () => {
      numberField.step = 3;
      await nextUpdate(numberField);
      arrowDown(input);
      expect(numberField.value).equal('-3');
    });

    it('should fire input event on input element when pressing ArrowDown', async () => {
      numberField.step = 3;
      await nextUpdate(numberField);
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      arrowDown(input);
      expect(spy).to.be.calledOnce;
    });

    it('should not change value on arrow keys when readonly', async () => {
      numberField.readonly = true;
      numberField.value = 0;
      await nextUpdate(numberField);

      arrowUp(input);
      expect(numberField.value).to.be.equal('0');

      arrowDown(input);
      expect(numberField.value).to.be.equal('0');
    });
  });

  describe('typed value', () => {
    let input;

    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
      input = numberField.inputElement;
      input.focus();
    });

    it('should keep exponent notation as typed', async () => {
      await sendKeys({ type: '1e3' });
      input.blur();
      expect(numberField.value).to.equal('1e3');
    });

    it('should keep more decimals than double precision as typed', async () => {
      await sendKeys({ type: '1.00000000000000000001' });
      input.blur();
      expect(numberField.value).to.equal('1.00000000000000000001');
    });

    it('should keep value as typed on focus and blur cycle', async () => {
      await sendKeys({ type: '1e3' });
      input.blur();
      input.focus();
      input.blur();
      expect(numberField.value).to.equal('1e3');
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field required></vaadin-number-field>');
      await nextRender();
    });

    it('should focus on required indicator click', () => {
      numberField.shadowRoot.querySelector('[part="required-indicator"]').click();
      expect(numberField.hasAttribute('focused')).to.be.true;
    });
  });
});
