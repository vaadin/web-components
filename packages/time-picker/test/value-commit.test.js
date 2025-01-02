import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-time-picker.js';
import { getAllItems } from './helpers.js';

describe('value commit', () => {
  let timePicker, valueChangedSpy, validateSpy, changeSpy, unparsableChangeSpy;

  function expectNoValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    expect(validateSpy).to.be.not.called;
    expect(changeSpy).to.be.not.called;
  }

  function expectValueCommit(value) {
    expect(valueChangedSpy).to.be.calledOnce;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(validateSpy).to.be.calledAfter(valueChangedSpy);
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
    expect(unparsableChangeSpy).to.be.not.called;
    expect(timePicker.value).to.equal(value);
  }

  function expectUnparsableValueCommit() {
    expect(valueChangedSpy).to.be.not.called;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
    expect(unparsableChangeSpy).to.be.calledOnce;
    expect(unparsableChangeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
  }

  function expectValidationOnly() {
    expect(valueChangedSpy).to.be.not.called;
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
  }

  beforeEach(async () => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    await nextRender();
    validateSpy = sinon.spy(timePicker, 'validate').named('validateSpy');

    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    timePicker.addEventListener('value-changed', valueChangedSpy);

    changeSpy = sinon.spy().named('changeSpy');
    timePicker.addEventListener('change', changeSpy);

    unparsableChangeSpy = sinon.spy().named('unparsableChangeSpy');
    timePicker.addEventListener('unparsable-change', unparsableChangeSpy);

    timePicker.focus();
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      timePicker.blur();
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

    it('should not commit but validate on close with outside click', () => {
      timePicker.click();
      outsideClick();
      expectValidationOnly();
    });

    it('should not commit on close with Escape', async () => {
      timePicker.click();
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });

    it('should not commit on ArrowDown', async () => {
      // Open the dropdown
      await sendKeys({ press: 'ArrowDown' });
      // Focus an item
      await sendKeys({ press: 'ArrowDown' });
      expectNoValueCommit();
    });

    it('should not commit on ArrowUp', async () => {
      // Open the dropdown
      await sendKeys({ press: 'ArrowUp' });
      // Focus an item
      await sendKeys({ press: 'ArrowUp' });
      expectNoValueCommit();
    });
  });

  describe('parsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: '12:00' });
    });

    it('should not commit by default', () => {
      expectNoValueCommit();
    });

    it('should commit on blur', () => {
      timePicker.blur();
      expectValueCommit('12:00');
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('12:00');
    });

    it('should commit on close with outside click', () => {
      outsideClick();
      expectValueCommit('12:00');
    });

    it('should revert on close with Escape', async () => {
      // Remove focus from the item.
      await sendKeys({ press: 'Escape' });
      // Close the dropdown.
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(timePicker.inputElement.value).to.equal('');
    });
  });

  describe('parsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '12:00' });
      await sendKeys({ press: 'Enter' });
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        timePicker.blur();
        expectValueCommit('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
      });

      it('should commit on outside click', () => {
        outsideClick();
        expectValueCommit('');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(timePicker.inputElement.value).to.equal('12:00');
      });
    });

    describe('value set programmatically', () => {
      beforeEach(() => {
        timePicker.value = '00:00';
        valueChangedSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        timePicker.blur();
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
      await sendKeys({ type: 'foo' });
    });

    it('should not commit by default', () => {
      expectNoValueCommit();
    });

    it('should commit as unparsable value change on blur', () => {
      timePicker.blur();
      expectUnparsableValueCommit();
      expect(timePicker.inputElement.value).to.equal('foo');
    });

    it('should commit as unparsable value change on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectUnparsableValueCommit();
      expect(timePicker.inputElement.value).to.equal('foo');
    });

    it('should commit as unparsable value change on close with outside click', () => {
      outsideClick();
      expectUnparsableValueCommit();
      expect(timePicker.inputElement.value).to.equal('foo');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(timePicker.inputElement.value).to.equal('');
    });
  });

  describe('unparsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });
      validateSpy.resetHistory();
      unparsableChangeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit as unparsable value change on blur', () => {
        timePicker.blur();
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on close with outside click', () => {
        outsideClick();
        expectUnparsableValueCommit();
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(timePicker.inputElement.value).to.equal('foo');
      });
    });

    describe('unparsable input changed', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ type: 'bar' });
      });

      it('should commit as unparsable value change on blur', () => {
        timePicker.blur();
        expectUnparsableValueCommit();
        expect(timePicker.inputElement.value).to.equal('bar');
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
        expect(timePicker.inputElement.value).to.equal('bar');
      });

      it('should commit as unparsable value change on close with outside click', () => {
        outsideClick();
        expectUnparsableValueCommit();
        expect(timePicker.inputElement.value).to.equal('bar');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(timePicker.inputElement.value).to.equal('foo');
      });
    });

    describe('value set programmatically', () => {
      beforeEach(() => {
        timePicker.value = '00:00';
        valueChangedSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        timePicker.blur();
        expectValidationOnly();
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectNoValueCommit();
      });
    });
  });

  describe('overlay', () => {
    beforeEach(async () => {
      timePicker.click();
      await sendKeys({ press: 'ArrowDown' });
    });

    it('should commit on item selection with click', () => {
      getAllItems(timePicker)[0].click();
      expectValueCommit('00:00');
    });

    it('should commit on item selection with Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('00:00');
    });
  });

  describe('value set programmatically', () => {
    beforeEach(() => {
      timePicker.value = '00:00';
      valueChangedSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit by default', () => {
        expectNoValueCommit();
      });

      it('should not commit but validate on blur', () => {
        timePicker.blur();
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

      it('should not commit but validate on close with outside click', () => {
        timePicker.click();
        outsideClick();
        expectValidationOnly();
      });

      it('should not commit on close with Escape', async () => {
        timePicker.click();
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
      });
    });

    describe('parsable input entered', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ type: '12:00' });
      });

      it('should commit on blur', () => {
        timePicker.blur();
        expectValueCommit('12:00');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('12:00');
      });

      it('should commit on close with outside click', () => {
        outsideClick();
        expectValueCommit('12:00');
      });

      it('should revert on close with Escape', async () => {
        // Remove focus from the item.
        await sendKeys({ press: 'Escape' });
        // Close the dropdown.
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(timePicker.inputElement.value).to.equal('00:00');
      });
    });

    describe('unparsable input entered', () => {
      beforeEach(async () => {
        timePicker.inputElement.select();
        await sendKeys({ type: 'foo' });
      });

      it('should commit an empty value on blur', () => {
        timePicker.blur();
        expectValueCommit('');
        expect(timePicker.inputElement.value).to.equal('foo');
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(timePicker.inputElement.value).to.equal('foo');
      });

      it('should commit an empty value on close with outside click', () => {
        outsideClick();
        expectValueCommit('');
        expect(timePicker.inputElement.value).to.equal('foo');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(timePicker.inputElement.value).to.equal('00:00');
      });
    });
  });

  describe('with clear button', () => {
    beforeEach(() => {
      timePicker.value = '00:00';
      timePicker.clearButtonVisible = true;
      valueChangedSpy.resetHistory();
    });

    it('should clear on clear button click', () => {
      timePicker.$.clearButton.click();
      expectValueCommit('');
    });

    it('should clear on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectValueCommit('');
    });
  });

  describe('with step', () => {
    beforeEach(() => {
      timePicker.step = 1;
    });

    it('should commit on ArrowUp', async () => {
      await sendKeys({ press: 'ArrowUp' });
      expectValueCommit('00:00:01');
    });

    it('should commit on ArrowDown', async () => {
      await sendKeys({ press: 'ArrowDown' });
      expectValueCommit('23:59:59');
    });

    it('should strip milliseconds and commit on Enter', async () => {
      await sendKeys({ type: '10:00:00.000' });
      await sendKeys({ press: 'Enter' });
      expectValueCommit('10:00:00');
      expect(timePicker.inputElement.value).to.equal('10:00:00');
    });

    it('should strip milliseconds without commit on Enter if value was unchanged', async () => {
      timePicker.value = '10:00:00';
      valueChangedSpy.resetHistory();
      await sendKeys({ type: '.000' });
      await sendKeys({ press: 'Enter' });
      expectNoValueCommit();
      expect(timePicker.inputElement.value).to.equal('10:00:00');
    });

    describe('with arrow key committed', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'ArrowDown' });
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
        changeSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        timePicker.blur();
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
  });
});
