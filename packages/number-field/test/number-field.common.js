import { expect } from '@vaadin/chai-plugins';
import { arrowDown, arrowUp, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

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

    it('should not prevent default for input wheel events when not focused', () => {
      const event = new CustomEvent('wheel', { cancelable: true });
      input.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
    });

    it('should prevent default for input wheel events when focused', () => {
      const event = new CustomEvent('wheel', { cancelable: true });
      input.focus();
      input.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should not prevent default for host wheel events when focused', () => {
      const event = new CustomEvent('wheel', { cancelable: true });
      input.focus();
      numberField.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.false;
    });
  });

  describe('has-input-value-changed event', () => {
    let hasInputValueChangedSpy;

    beforeEach(async () => {
      numberField = fixtureSync('<vaadin-number-field></vaadin-number-field>');
      await nextRender();
      hasInputValueChangedSpy = sinon.spy();
      numberField.addEventListener('has-input-value-changed', hasInputValueChangedSpy);
      numberField.inputElement.focus();
    });

    it('should fire the event when entering and removing a valid number', async () => {
      await sendKeys({ type: '555' });
      expect(hasInputValueChangedSpy).to.be.calledOnce;

      hasInputValueChangedSpy.resetHistory();
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      expect(hasInputValueChangedSpy).to.be.calledOnce;
    });

    it('should fire the event when entering and removing an invalid number', async () => {
      await sendKeys({ type: '--5' });
      expect(hasInputValueChangedSpy).to.be.calledOnce;

      hasInputValueChangedSpy.resetHistory();
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      expect(hasInputValueChangedSpy).to.be.calledOnce;
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
