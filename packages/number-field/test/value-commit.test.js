import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-number-field.js';

describe('value commit', () => {
  let numberField, valueChangedSpy, validateSpy, changeSpy, unparsableChangeSpy;

  function expectNoValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.not.called;
    expect(changeSpy).to.be.not.called;
  }

  function expectValueCommit(value) {
    expect(valueChangedSpy).to.be.calledOnce;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(validateSpy.firstCall).to.be.calledAfter(valueChangedSpy.firstCall);
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
    expect(numberField.value).to.equal(value);
  }

  function expectUnparsableValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
    expect(unparsableChangeSpy).to.be.calledOnce;
    expect(unparsableChangeSpy).to.be.calledAfter(validateSpy);
  }

  function expectValidationOnly() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.calledOnce;
    expect(changeSpy).to.be.not.called;
  }

  beforeEach(async () => {
    numberField = fixtureSync(`<vaadin-number-field></vaadin-number-field>`);
    await nextRender();
    validateSpy = sinon.spy(numberField, 'validate').named('validateSpy');

    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    numberField.addEventListener('value-changed', valueChangedSpy);

    changeSpy = sinon.spy().named('changeSpy');
    numberField.addEventListener('change', changeSpy);

    unparsableChangeSpy = sinon.spy().named('unparsableChangeSpy');
    numberField.addEventListener('unparsable-change', unparsableChangeSpy);

    numberField.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', async () => {
      numberField.blur();
      await nextUpdate(numberField);
      expectValidationOnly();
    });

    it('should not commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      expectNoValueCommit();
    });

    it('should not commit on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      await nextUpdate(numberField);
      expectNoValueCommit();
    });
  });

  describe('parsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1' });
      await nextUpdate(numberField);
    });

    it('should commit on blur', async () => {
      numberField.blur();
      await nextUpdate(numberField);
      expectValueCommit('1');
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      expectValueCommit('1');
    });
  });

  describe('parsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1' });
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      changeSpy.resetHistory();
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        numberField.inputElement.select();
        await sendKeys({ press: 'Backspace' });
        await nextUpdate(numberField);
      });

      it('should commit on blur', async () => {
        numberField.blur();
        await nextUpdate(numberField);
        expectValueCommit('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await nextUpdate(numberField);
        expectValueCommit('');
      });
    });

    describe('value set programmatically', () => {
      beforeEach(async () => {
        numberField.value = '1234';
        await nextUpdate(numberField);
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        numberField.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });
    });
  });

  describe('unparsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: '-' });
      await nextUpdate(numberField);
    });

    it('should not commit by default', async () => {
      await nextUpdate(numberField);
      expectNoValueCommit();
    });

    it('should commit as unparsable value change on blur', async () => {
      numberField.blur();
      await nextUpdate(numberField);
      expectUnparsableValueCommit();
      expect(numberField.inputElement.validity.badInput).to.be.true;
    });

    it('should commit as unparsable value change on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      expectUnparsableValueCommit();
      expect(numberField.inputElement.validity.badInput).to.be.true;
    });
  });

  describe('unparsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '-' });
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      validateSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'Backspace' });
        await nextUpdate(numberField);
        validateSpy.resetHistory();
        unparsableChangeSpy.resetHistory();
      });

      it('should commit as unparsable value change on blur', async () => {
        numberField.blur();
        await nextUpdate(numberField);
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await nextUpdate(numberField);
        expectUnparsableValueCommit();
      });
    });
  });

  describe('value set programmatically', () => {
    beforeEach(async () => {
      numberField.value = '1234';
      await nextUpdate(numberField);
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', async () => {
        numberField.blur();
        await nextUpdate(numberField);
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await nextUpdate(numberField);
        expectNoValueCommit();
      });

      it('should not commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        await nextUpdate(numberField);
        expectNoValueCommit();
      });
    });

    describe('parsable input entered', () => {
      beforeEach(async () => {
        numberField.inputElement.select();
        await sendKeys({ type: '1' });
        await nextUpdate(numberField);
      });

      it('should commit on blur', async () => {
        numberField.blur();
        await nextUpdate(numberField);
        expectValueCommit('1');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await nextUpdate(numberField);
        expectValueCommit('1');
      });
    });

    describe('unparsable input entered', () => {
      beforeEach(async () => {
        numberField.inputElement.select();
        await sendKeys({ type: '-' });
        await nextUpdate(numberField);
      });

      it('should commit an empty value on blur', async () => {
        numberField.blur();
        await nextUpdate(numberField);
        expectValueCommit('');
        expect(numberField.inputElement.validity.badInput).to.be.true;
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await nextUpdate(numberField);
        expectValueCommit('');
        expect(numberField.inputElement.validity.badInput).to.be.true;
      });
    });
  });

  describe('with clear button', () => {
    beforeEach(async () => {
      numberField.value = '1';
      numberField.clearButtonVisible = true;
      await nextUpdate(numberField);
      valueChangedSpy.resetHistory();
    });

    it('should clear on clear button click', async () => {
      numberField.$.clearButton.click();
      await nextUpdate(numberField);
      expectValueCommit('');
    });

    it('should clear on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      await nextUpdate(numberField);
      expectValueCommit('');
    });
  });

  describe('keyboard stepping', () => {
    it('should commit on ArrowUp', async () => {
      await sendKeys({ press: 'ArrowUp' });
      await nextUpdate(numberField);
      expectValueCommit('1');
    });

    it('should commit on ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      await nextUpdate(numberField);
      expectValueCommit('-1');
    });
  });

  describe('keyboard stepping committed', () => {
    beforeEach(async () => {
      await sendKeys({ press: 'ArrowUp' });
      await nextUpdate(numberField);
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
    });

    it('should not commit but validate on blur', async () => {
      numberField.blur();
      await nextUpdate(numberField);
      expectValidationOnly();
    });

    it('should not commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      expectNoValueCommit();
    });
  });

  describe('value control buttons', () => {
    let increaseButton, decreaseButton;

    beforeEach(() => {
      increaseButton = numberField.shadowRoot.querySelector('[part~="increase-button"]');
      decreaseButton = numberField.shadowRoot.querySelector('[part~="decrease-button"]');
    });

    it('should commit on increase button click', async () => {
      increaseButton.click();
      await nextUpdate(numberField);
      expectValueCommit('1');
    });

    it('should commit on decrease button click', async () => {
      decreaseButton.click();
      await nextUpdate(numberField);
      expectValueCommit('-1');
    });
  });

  describe('value control button click committed', () => {
    beforeEach(async () => {
      numberField.shadowRoot.querySelector('[part~="increase-button"]').click();
      await nextUpdate(numberField);
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
    });

    it('should not commit but validate on blur', async () => {
      numberField.blur();
      await nextUpdate(numberField);
      expectValidationOnly();
    });

    it('should not commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextUpdate(numberField);
      expectNoValueCommit();
    });

    describe('value set programmatically', () => {
      beforeEach(async () => {
        numberField.value = '1234';
        await nextUpdate(numberField);
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        numberField.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });
    });
  });
});
