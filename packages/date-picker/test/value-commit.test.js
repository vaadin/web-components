import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick, tap } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-picker.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { untilOverlayRendered, untilOverlayScrolled } from './helpers.js';

describe('value commit', () => {
  let datePicker, valueChangedSpy, validateSpy, changeSpy, unparsableChangeSpy, todayDate, yesterdayDate;

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
    expect(unparsableChangeSpy).to.be.not.called;
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.firstCall).to.be.calledAfter(validateSpy.firstCall);
    expect(datePicker.value).to.equal(value);
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
    // TODO: Optimize the number of validation runs.
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
  }

  beforeEach(async () => {
    datePicker = fixtureSync(`<vaadin-date-picker></vaadin-date-picker>`);
    await nextRender();
    validateSpy = sinon.spy(datePicker, 'validate').named('validateSpy');

    valueChangedSpy = sinon.spy().named('valueChangedSpy');
    datePicker.addEventListener('value-changed', valueChangedSpy);

    changeSpy = sinon.spy().named('changeSpy');
    datePicker.addEventListener('change', changeSpy);

    unparsableChangeSpy = sinon.spy().named('unparsableChangeSpy');
    datePicker.addEventListener('unparsable-change', unparsableChangeSpy);

    datePicker.focus();

    todayDate = datePicker._formatISO(new Date());
    yesterdayDate = datePicker._formatISO(new Date(Date.now() - 3600 * 1000 * 24));
  });

  describe('default', () => {
    it('should not commit but validate on blur', () => {
      datePicker.blur();
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

    it('should not commit but validate on close with outside click', async () => {
      datePicker.click();
      await untilOverlayRendered(datePicker);
      outsideClick();
      expectValidationOnly();
    });

    it('should not commit on close with Escape', async () => {
      datePicker.click();
      await untilOverlayRendered(datePicker);
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });
  });

  describe('parsable input entered', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
      await untilOverlayRendered(datePicker);
    });

    it('should commit on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit('2001-01-01');
    });

    it('should commit on close with outside click', () => {
      outsideClick();
      expectValueCommit('2001-01-01');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('parsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: '1/1/2001' });
      await sendKeys({ press: 'Enter' });
      await untilOverlayRendered(datePicker);
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit on blur', () => {
        datePicker.blur();
        expectValueCommit('');
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
      });

      it('should commit on Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectValueCommit('');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'ArrowDown' });
        await untilOverlayRendered(datePicker);
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
      });
    });

    describe('value set programmatically', () => {
      beforeEach(() => {
        datePicker.value = todayDate;
        valueChangedSpy.resetHistory();
        validateSpy.resetHistory();
      });

      it('should not commit but validate on blur', () => {
        datePicker.blur();
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
      await untilOverlayRendered(datePicker);
    });

    it('should commit as unparsable value change on Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectUnparsableValueCommit();
      expect(datePicker.inputElement.value).to.equal('foo');
    });

    it('should commit as unparsable value change on close with outside click', () => {
      outsideClick();
      expectUnparsableValueCommit();
      expect(datePicker.inputElement.value).to.equal('foo');
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
      expect(datePicker.inputElement.value).to.equal('');
    });
  });

  describe('unparsable input committed', () => {
    beforeEach(async () => {
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });
      await untilOverlayRendered(datePicker);
      validateSpy.resetHistory();
      unparsableChangeSpy.resetHistory();
    });

    describe('input cleared with Backspace', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ press: 'Backspace' });
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on outside click', () => {
        outsideClick();
        expectUnparsableValueCommit();
      });
    });

    describe('unparsable input changed', () => {
      beforeEach(async () => {
        await sendKeys({ type: 'bar' });
        await untilOverlayRendered(datePicker);
      });

      it('should commit as unparsable value change on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectUnparsableValueCommit();
      });

      it('should commit as unparsable value change on close with outside click', () => {
        outsideClick();
        expectUnparsableValueCommit();
      });

      it('should clear and commit as unparsable value change on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectUnparsableValueCommit();
        expect(datePicker.inputElement.value).to.equal('');
      });
    });
  });

  describe('overlay date focused', () => {
    beforeEach(async () => {
      // Open the dropdown.
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(datePicker);
      // Focus yesterday's date.
      await sendKeys({ press: 'ArrowLeft' });
      await untilOverlayScrolled(datePicker);
    });

    it('should commit on focused date selection with click', () => {
      const date = getDeepActiveElement();
      tap(date);
      expectValueCommit(yesterdayDate);
    });

    it('should commit on focused date selection with Enter', async () => {
      await sendKeys({ press: 'Enter' });
      expectValueCommit(yesterdayDate);
    });

    it('should commit on focused date selection with Space', async () => {
      await sendKeys({ press: 'Space' });
      expectValueCommit(yesterdayDate);
    });

    it('should commit focused date on close with outside click', () => {
      outsideClick();
      expectValueCommit(yesterdayDate);
    });

    it('should revert on close with Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectNoValueCommit();
    });
  });

  describe('overlay date committed', () => {
    beforeEach(async () => {
      // Open the dropdown.
      await sendKeys({ press: 'ArrowDown' });
      await untilOverlayRendered(datePicker);
      // Select today's date.
      await sendKeys({ press: 'Space' });
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
    });

    it('should commit an empty value on current date deselection with Space', async () => {
      await sendKeys({ press: 'Space' });
      expectValueCommit('');
    });

    it('should commit the deselected date again on close with outside click', async () => {
      await sendKeys({ press: 'Space' });
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
      changeSpy.resetHistory();
      outsideClick();
      expectValueCommit(todayDate);
    });

    describe('another date focused', () => {
      beforeEach(async () => {
        // Focus yesterday's date.
        await sendKeys({ press: 'ArrowLeft' });
        await untilOverlayScrolled(datePicker);
      });

      it('should commit on focused date selection with click', () => {
        const date = getDeepActiveElement();
        tap(date);
        expectValueCommit(yesterdayDate);
      });

      it('should commit on focused date selection with Space', async () => {
        await sendKeys({ press: 'Space' });
        expectValueCommit(yesterdayDate);
      });

      it('should commit on focused date selection with Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit(yesterdayDate);
      });
    });
  });

  describe('value set programmatically', () => {
    let initialInputElementValue;

    beforeEach(() => {
      datePicker.value = todayDate;
      initialInputElementValue = datePicker.inputElement.value;
      valueChangedSpy.resetHistory();
      validateSpy.resetHistory();
    });

    describe('default', () => {
      it('should not commit but validate on blur', () => {
        datePicker.blur();
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

      it('should not commit on close with outside click', async () => {
        datePicker.click();
        await untilOverlayRendered(datePicker);
        outsideClick();
        expectNoValueCommit();
      });

      it('should not commit on close with Escape', async () => {
        datePicker.click();
        await untilOverlayRendered(datePicker);
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
      });
    });

    describe('parsable input entered', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: '1/1/2001' });
        await untilOverlayRendered(datePicker);
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('2001-01-01');
      });

      it('should commit on close with outside click', () => {
        outsideClick();
        expectValueCommit('2001-01-01');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });

    describe('unparsable input entered', () => {
      beforeEach(async () => {
        datePicker.inputElement.select();
        await sendKeys({ type: 'foo' });
        await untilOverlayRendered(datePicker);
      });

      it('should commit an empty value on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('foo');
      });

      it('should commit an empty value on close with outside click', () => {
        outsideClick();
        expectValueCommit('');
        expect(datePicker.inputElement.value).to.equal('foo');
      });

      it('should revert on close with Escape', async () => {
        await sendKeys({ press: 'Escape' });
        expectNoValueCommit();
        expect(datePicker.inputElement.value).to.equal(initialInputElementValue);
      });
    });
  });

  describe('with clear button', () => {
    beforeEach(() => {
      datePicker.value = todayDate;
      datePicker.clearButtonVisible = true;
      validateSpy.resetHistory();
      valueChangedSpy.resetHistory();
    });

    it('should clear on clear button click', () => {
      datePicker.$.clearButton.click();
      expectValueCommit('');
    });

    it('should clear on Escape', async () => {
      await sendKeys({ press: 'Escape' });
      expectValueCommit('');
    });
  });
});
