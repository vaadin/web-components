import { expect } from '@vaadin/chai-plugins';
import { sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-date-time-picker.js';
import { changeInputValue } from './helpers.js';

function describeForEachPicker(title, fn) {
  ['date-picker', 'time-picker'].forEach((pickerType) => {
    describe(`${pickerType} - ${title}`, () => fn(pickerType));
  });
}

async function enterInput(picker, input) {
  picker.focus();
  await sendKeys({ press: 'ControlOrMeta+A' });
  await sendKeys({ type: input });
  await nextRender();
}

async function enterParsableInput(picker) {
  picker.focus();
  await enterInput(picker, picker.matches('[slot=date-picker]') ? '1/1/2001' : '12:00');
}

async function enterUnparsableInput(picker) {
  await enterInput(picker, 'foo');
}

async function clearInput(picker) {
  picker.focus();
  await sendKeys({ press: 'ControlOrMeta+A' });
  await sendKeys({ press: 'Backspace' });
  await nextRender();
}

describe('value commit', () => {
  let dateTimePicker, datePicker, timePicker, unparsableChangeSpy, changeSpy, validateSpy;

  function getPicker(pickerType) {
    return [
      dateTimePicker.querySelector(`[slot=${pickerType}]`),
      dateTimePicker.querySelector(`[slot$=picker]:not([slot=${pickerType}])`),
    ];
  }

  beforeEach(async () => {
    dateTimePicker = fixtureSync(`
      <div>
        <input/>
        <vaadin-date-time-picker></vaadin-date-time-picker>
        <input/>
      </div>
    `).children[1];
    await nextRender();
    [datePicker, timePicker] = getPicker('date-picker');
    validateSpy = sinon.spy();
    dateTimePicker.addEventListener('validated', validateSpy);
    changeSpy = sinon.spy();
    dateTimePicker.addEventListener('change', changeSpy);
    unparsableChangeSpy = sinon.spy();
    dateTimePicker.addEventListener('unparsable-change', unparsableChangeSpy);
  });

  function resetSpyHistories() {
    validateSpy.resetHistory();
    changeSpy.resetHistory();
    unparsableChangeSpy.resetHistory();
  }

  async function expectNoValueCommit() {
    await nextRender();
    expect(validateSpy).to.be.not.called;
    expect(changeSpy).to.be.not.called;
    expect(unparsableChangeSpy).to.be.not.called;
    resetSpyHistories();
  }

  async function expectValueCommit() {
    await nextRender();
    expect(validateSpy).to.be.called;
    expect(unparsableChangeSpy).to.be.not.called;
    expect(changeSpy).to.be.calledOnce;
    expect(changeSpy.calledAfter(validateSpy)).to.be.true;
    resetSpyHistories();
  }

  async function expectUnparsableValueCommit() {
    await nextRender();
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
    expect(unparsableChangeSpy).to.be.calledOnce;
    expect(unparsableChangeSpy.calledAfter(validateSpy)).to.be.true;
    resetSpyHistories();
  }

  async function expectValidationOnly() {
    await nextRender();
    expect(validateSpy).to.be.called;
    expect(changeSpy).to.be.not.called;
    expect(unparsableChangeSpy).to.be.not.called;
    resetSpyHistories();
  }

  describeForEachPicker('focused (overlay closed)', (pickerType) => {
    let picker;

    beforeEach(async () => {
      await nextRender();
      [picker] = getPicker(pickerType);
      picker.focus();
      await nextRender();
      resetSpyHistories();
    });

    it('should not commit on picker Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await expectNoValueCommit();
    });

    it('should not commit on Tab to other picker', async () => {
      await sendKeys({ press: picker.nextElementSibling ? 'Tab' : 'Shift+Tab' });
      await expectNoValueCommit();
    });

    it('should not commit but validate on Tab to outside', async () => {
      await sendKeys({ press: picker.nextElementSibling ? 'Shift+Tab' : 'Tab' });
      await expectValidationOnly();
    });

    it('should not commit but validate on picker blur', async () => {
      picker.blur();
      await expectValidationOnly();
    });

    it('should not commit on picker Enter if value is temporarily changed', async () => {
      await sendKeys({ type: 'a' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Enter' });
      await expectNoValueCommit();
    });
  });

  describeForEachPicker('clicked (overlay opened)', (pickerType) => {
    let picker;

    beforeEach(async () => {
      [picker] = getPicker(pickerType);
      await sendMouseToElement({ type: 'click', element: picker });
      await nextRender();
    });

    it('should not commit but validate on date-time-picker outside click', async () => {
      outsideClick();
      await expectValidationOnly();
    });
  });

  describeForEachPicker('incomplete input entered', (pickerType) => {
    let picker, otherPicker;

    beforeEach(async () => {
      [picker, otherPicker] = getPicker(pickerType);
      await enterParsableInput(picker);
      resetSpyHistories();
    });

    it('should not commit on picker Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await expectNoValueCommit();
    });

    it('should not commit on other picker click', async () => {
      await sendMouseToElement({ type: 'click', element: otherPicker });
      await expectNoValueCommit();
    });

    it('should commit as unparsable on date-time-picker outside click', async () => {
      outsideClick();
      await expectUnparsableValueCommit();
    });
  });

  describeForEachPicker('unparsable input entered', (pickerType) => {
    let picker, otherPicker;

    beforeEach(async () => {
      [picker, otherPicker] = getPicker(pickerType);
      await enterUnparsableInput(picker);
      resetSpyHistories();
    });

    it('should commit as unparsable on picker Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await expectUnparsableValueCommit();
    });

    it('should commit as unparsable on other picker click', async () => {
      await sendMouseToElement({ type: 'click', element: otherPicker });
      await expectUnparsableValueCommit();
    });

    it('should commit as unparsable on date-time-picker on outside click', async () => {
      outsideClick();
      await expectUnparsableValueCommit();
    });
  });

  describeForEachPicker('complete input entered', (pickerType) => {
    let picker, otherPicker;

    beforeEach(async () => {
      [picker, otherPicker] = getPicker(pickerType);
      await enterParsableInput(otherPicker);
      await sendKeys({ press: 'Enter' });
      await enterParsableInput(picker);
      resetSpyHistories();
    });

    it('should commit on picker Enter', async () => {
      await sendKeys({ press: 'Enter' });
      await nextRender();
      await expectValueCommit();
    });

    it('should commit on other picker click', async () => {
      await sendMouseToElement({ type: 'click', element: otherPicker });
      await expectValueCommit();
    });

    it('should commit on date-time-picker outside click', async () => {
      outsideClick();
      await expectValueCommit();
    });
  });

  describe('initially valid value', () => {
    beforeEach(async () => {
      dateTimePicker.value = '2002-02-02T12:00';
      await nextRender();
      resetSpyHistories();
    });

    describeForEachPicker('value partially cleared (= incomplete value)', (pickerType) => {
      let picker, otherPicker;

      beforeEach(async () => {
        [picker, otherPicker] = getPicker(pickerType);
        await clearInput(picker);
      });

      it('should not commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await expectNoValueCommit();
      });

      it('should not commit on other picker click', async () => {
        await sendMouseToElement({ type: 'click', element: otherPicker });
        await expectNoValueCommit();
      });

      it('should commit on date-time-picker outside click', async () => {
        outsideClick();
        await expectValueCommit();
      });
    });
  });
  describe('initially invalid value', () => {
    beforeEach(async () => {
      dateTimePicker.min = '2011-01-01T12:00';
      await enterInput(datePicker, '2/2/2002');
      await sendKeys({ press: 'Enter' });
      await enterParsableInput(timePicker);
      outsideClick();
      await nextRender();
      resetSpyHistories();
    });

    describeForEachPicker('value partially cleared (= incomplete value)', (pickerType) => {
      let picker, otherPicker;

      beforeEach(async () => {
        [picker, otherPicker] = getPicker(pickerType);
        await clearInput(picker);
      });

      it('should commit on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await expectValueCommit();
      });

      it('should commit on other picker click', async () => {
        await sendMouseToElement({ type: 'click', element: otherPicker });
        await expectValueCommit();
      });

      it('should commit on date-time-picker outside click', async () => {
        outsideClick();
        await expectValueCommit();
      });
    });
  });

  describe('initially invalid empty field', () => {
    beforeEach(() => {
      dateTimePicker.required = true;
      dateTimePicker.validate();
    });

    describeForEachPicker('incomplete input entered', (pickerType) => {
      let picker, otherPicker;

      beforeEach(async () => {
        [picker, otherPicker] = getPicker(pickerType);
        await enterParsableInput(picker);
      });

      it('should commit as unparsable on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await expectUnparsableValueCommit();
      });

      it('should commit as unparsable on other picker click', async () => {
        await sendMouseToElement({ type: 'click', element: otherPicker });
        await expectUnparsableValueCommit();
      });

      it('should commit as unparsable on date-time-picker outside click', async () => {
        outsideClick();
        await expectUnparsableValueCommit();
      });
    });

    describeForEachPicker('invalid input entered', (pickerType) => {
      let picker, otherPicker;

      beforeEach(async () => {
        [picker, otherPicker] = getPicker(pickerType);
        await enterUnparsableInput(picker);
      });

      it('should commit as unparsable on Enter', async () => {
        await sendKeys({ press: 'Enter' });
        await expectUnparsableValueCommit();
      });

      it('should commit as unparsable on other picker click', async () => {
        await sendMouseToElement({ type: 'click', element: otherPicker });
        await expectUnparsableValueCommit();
      });

      it('should commit as unparsable on date-time-picker outside click', async () => {
        outsideClick();
        await expectUnparsableValueCommit();
      });
    });
  });

  describe('defined range', () => {
    beforeEach(async () => {
      dateTimePicker.min = '1980-02-02T02:00';
      dateTimePicker.max = '1990-02-02T02:00';
      await nextRender();
      resetSpyHistories();
    });

    it('should commit on date-picker Enter when value is changed to a date outside the set range', async () => {
      await enterParsableInput(timePicker);
      await enterInput(datePicker, '2/2/2002');
      await sendKeys({ press: 'Enter' });
      await expectValueCommit();
    });

    it('should commit on date-picker outside click when value is changed to a date outside the set range', async () => {
      await enterParsableInput(timePicker);
      await enterInput(datePicker, '2/2/2002');
      outsideClick();
      await expectValueCommit();
    });

    it('should commit as unparsable on date-picker outside click when value is changed to a date inside the set range while time-picker is empty', async () => {
      await enterInput(datePicker, '2/2/1985');
      outsideClick();
      await expectUnparsableValueCommit();
    });

    it('should commit on date-picker outside click when value is changed to a date inside the set range while time-picker is filled', async () => {
      await enterParsableInput(timePicker);
      await enterInput(datePicker, '2/2/1985');
      outsideClick();
      await expectValueCommit();
    });

    it('should not commit on time-picker Enter when value is changed while date-picker is empty', async () => {
      await enterParsableInput(timePicker);
      await sendKeys({ press: 'Enter' });
      await expectNoValueCommit();
    });
  });

  describe('value set programmatically', () => {
    it('should not fire change on programmatic value change', () => {
      dateTimePicker.value = '2020-01-17T16:00';
      expect(changeSpy).to.be.not.called;
    });

    it('should not fire change on programmatic value change after manual one', () => {
      dateTimePicker.value = '2020-01-17T16:00'; // Init with valid value
      changeInputValue(datePicker, '2020-01-20');
      resetSpyHistories();
      dateTimePicker.value = '2020-01-10T12:00';
      expect(changeSpy).to.be.not.called;
    });

    it('should not fire change on programmatic value change after partial manual one', () => {
      changeInputValue(datePicker, '2020-01-17');
      // Time picker has no value so date time picker value is still empty
      dateTimePicker.value = '2020-01-17T16:00';
      expect(changeSpy).to.be.not.called;
    });
  });
});
