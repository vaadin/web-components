import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-number-field.js';

describe('value commit', () => {
  let numberField, valueChangedSpy, validateSpy, changeSpy;

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

    numberField.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      numberField.blur();
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
      numberField.blur();
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
        numberField.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        numberField.blur();
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

    it('should not commit but validate on blur', () => {
      numberField.blur();
      expectValidationOnly();
      expect(numberField.inputElement.validity.badInput).to.be.true;
    });

    // FIXME: https://github.com/vaadin/web-components/issues/5113
    it.skip('should not commit but validate on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValidationOnly();
      expect(numberField.inputElement.validity.badInput).to.be.true;
    });
  });

  describe('unparsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '-' });
      await sendKeys({ type: 'Enter' });
      validateSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        numberField.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should not commit but validate on blur', () => {
        numberField.blur();
        expectValidationOnly();
      });

      // FIXME: https://github.com/vaadin/web-components/issues/5113
      it.skip('should not commit but validate on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValidationOnly();
      });
    });
  });

  describe('value set programmatically', () => {
    beforeEach(() => {
      numberField.value = '1234';
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', () => {
        numberField.blur();
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
        numberField.inputElement.select();
        await sendKeys({ type: '1' });
      });

      it('should commit on blur', () => {
        numberField.blur();
        expectValueCommit('1');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('1');
      });
    });

    describe('unparsable input entered', () => {
      beforeEach(async () => {
        numberField.inputElement.select();
        await sendKeys({ type: '-' });
      });

      it('should commit an empty value on blur', () => {
        numberField.blur();
        expectValueCommit('');
        expect(numberField.inputElement.validity.badInput).to.be.true;
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(numberField.inputElement.validity.badInput).to.be.true;
      });
    });
  });

  describe('with clear button', () => {
    beforeEach(() => {
      numberField.value = '1';
      numberField.clearButtonVisible = true;
      valueChangedSpy.resetHistory();
    });

    it('should clear on clear button click', () => {
      numberField.$.clearButton.click();
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
        numberField.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });
    });
  });

  describe('spinner buttons', () => {
    let increaseButton, decreaseButton;

    beforeEach(() => {
      increaseButton = numberField.shadowRoot.querySelector('[part=increase-button]');
      decreaseButton = numberField.shadowRoot.querySelector('[part=decrease-button]');
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
      beforeEach(async () => {
        increaseButton.click();
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
        changeSpy.resetHistory();
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
