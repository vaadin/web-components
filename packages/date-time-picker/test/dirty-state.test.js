import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-date-time-picker.js';
import { waitForOverlayRender } from '@vaadin/date-picker/test/helpers.js';

describe('dirty state', () => {
  let dateTimePicker, datePicker, timePicker;

  const fixtures = {
    default: '<vaadin-date-time-picker></vaadin-date-time-picker>',
    slotted: `
      <vaadin-date-time-picker>
        <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
        <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
      </vaadin-date-time-picker>
    `,
  };

  ['default', 'slotted'].forEach((type) => {
    describe(type, () => {
      beforeEach(async () => {
        dateTimePicker = fixtureSync(fixtures[type]);
        await nextRender();
        datePicker = dateTimePicker.querySelector('[slot=date-picker]');
        timePicker = dateTimePicker.querySelector('[slot=time-picker]');
      });

      it('should not be dirty by default', () => {
        expect(dateTimePicker.dirty).to.be.false;
      });

      it('should not be dirty after programmatic value change', async () => {
        dateTimePicker.value = '2023-01-01T00:00';
        expect(dateTimePicker.dirty).to.be.false;
      });

      it('should not be dirty after date-picker blur without change', () => {
        datePicker.focus();
        datePicker.blur();
        expect(dateTimePicker.dirty).to.be.false;
      });

      it('should not be dirty after time-picker blur without change', () => {
        timePicker.focus();
        timePicker.blur();
        expect(dateTimePicker.dirty).to.be.false;
      });

      it('should be dirty after date-picker change', async () => {
        datePicker.focus();
        datePicker.click();
        await waitForOverlayRender();
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        expect(dateTimePicker.dirty).to.be.true;
      });

      it('should be dirty after time-picker change', async () => {
        timePicker.focus();
        timePicker.click();
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        expect(dateTimePicker.dirty).to.be.true;
      });

      it('should be dirty after time-picker user input', () => {
        fire(timePicker.inputElement, 'input');
        expect(dateTimePicker.dirty).to.be.true;
      });

      it('should be dirty after date-picker user input', () => {
        fire(datePicker.inputElement, 'input');
        expect(dateTimePicker.dirty).to.be.true;
      });

      it('should fire dirty-changed event when the state changes', () => {
        const spy = sinon.spy();
        dateTimePicker.addEventListener('dirty-changed', spy);
        dateTimePicker.dirty = true;
        expect(spy.calledOnce).to.be.true;
      });
    });
  });
});
