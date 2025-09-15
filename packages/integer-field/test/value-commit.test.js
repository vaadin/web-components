import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-integer-field.js';

describe('value commit', () => {
  let integerField, valueChangedSpy, validateSpy, changeSpy, unparsableChangeSpy;

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
    expect(integerField.value).to.equal(value);
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
    integerField = fixtureSync(`<vaadin-integer-field></vaadin-integer-field>`);
    await nextRender();
    validateSpy = sinon.spy(integerField, 'validate').named('validateSpy');

    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    integerField.addEventListener('value-changed', valueChangedSpy);

    changeSpy = sinon.spy().named('changeSpy');
    integerField.addEventListener('change', changeSpy);

    unparsableChangeSpy = sinon.spy().named('unparsableChangeSpy');
    integerField.addEventListener('unparsable-change', unparsableChangeSpy);

    integerField.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      integerField.blur();
      expectValidationOnly();
    });

    it('should not commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectNoValueCommit();
    });

    it('should not commit on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });
  });

  describe('parsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1' });
    });

    it('should commit on blur', () => {
      integerField.blur();
      expectValueCommit('1');
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('1');
    });
  });

  describe('parsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1' });
      await sendKeys({ press: 'Enter' });
      changeSpy.resetHistory();
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        integerField.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        integerField.blur();
        expectValueCommit('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
      });
    });
  });

  describe('unparsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: '-' });
    });

    it('should not commit by default', () => {
      expectNoValueCommit();
    });

    it('should commit as unparsable value change on blur', () => {
      integerField.blur();
      expectUnparsableValueCommit();
      expect(integerField.inputElement.validity.badInput).to.be.true;
    });

    it('should commit as unparsable value change on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectUnparsableValueCommit();
      expect(integerField.inputElement.validity.badInput).to.be.true;
    });
  });

  describe('unparsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '-' });
      await sendKeys({ press: 'Enter' });
      validateSpy.resetHistory();
      unparsableChangeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'Backspace' });
        validateSpy.resetHistory();
      });

      it('should commit as unparsable value change on blur', () => {
        integerField.blur();
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
      });
    });
  });

  describe('value set programmatically', () => {
    beforeEach(() => {
      integerField.value = '1234';
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', () => {
        integerField.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });

      it('should not commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
      });
    });

    describe('parsable input entered', () => {
      beforeEach(async () => {
        integerField.inputElement.select();
        await sendKeys({ type: '1' });
      });

      it('should commit on blur', () => {
        integerField.blur();
        expectValueCommit('1');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('1');
      });
    });

    describe('unparsable input entered', () => {
      beforeEach(async () => {
        integerField.inputElement.select();
        await sendKeys({ type: '-' });
      });

      it('should commit an empty value on blur', () => {
        integerField.blur();
        expectValueCommit('');
        expect(integerField.inputElement.validity.badInput).to.be.true;
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(integerField.inputElement.validity.badInput).to.be.true;
      });
    });
  });

  describe('with clear button', () => {
    beforeEach(() => {
      integerField.value = '1';
      integerField.clearButtonVisible = true;
      valueChangedSpy.resetHistory();
    });

    it('should clear on clear button click', () => {
      integerField.$.clearButton.click();
      expectValueCommit('');
    });

    it('should clear on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectValueCommit('');
    });
  });

  describe('keyboard stepping', () => {
    it('should commit on ArrowUp', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expectValueCommit('1');
    });

    it('should commit on ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expectValueCommit('-1');
    });

    describe('arrow key committed', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'ArrowUp' });
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
        changeSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        integerField.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });
    });
  });

  describe('value control buttons', () => {
    let increaseButton, decreaseButton;

    beforeEach(() => {
      increaseButton = integerField.shadowRoot.querySelector('[part~="increase-button"]');
      decreaseButton = integerField.shadowRoot.querySelector('[part~="decrease-button"]');
    });

    it('should commit on increase button click', () => {
      increaseButton.click();
      expectValueCommit('1');
    });

    it('should commit on decrease button click', () => {
      decreaseButton.click();
      expectValueCommit('-1');
    });

    describe('click committed', () => {
      beforeEach(() => {
        increaseButton.click();
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
        changeSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        integerField.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });
    });
  });
});
