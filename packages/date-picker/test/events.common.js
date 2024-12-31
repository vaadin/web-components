import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { open, waitForScrollToFinish } from './helpers.js';

describe('events', () => {
  let datePicker;

  describe('change event', () => {
    let changeSpy;

    beforeEach(async () => {
      datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
      await nextRender();
      changeSpy = sinon.spy();
      datePicker.addEventListener('change', changeSpy);
      datePicker.inputElement.focus();
    });

    it('should not be fired on programmatic value change when opened', async () => {
      await open(datePicker);
      datePicker.value = '2000-01-01';
      datePicker.close();
      expect(changeSpy.called).to.be.false;
    });

    it('should not be fired on programmatic value change when having user input', async () => {
      await sendKeys({ type: '1/2/2000' });
      await waitForScrollToFinish(datePicker);
      datePicker.value = '2000-01-01';
      datePicker.close();
      expect(changeSpy.called).to.be.false;
    });
  });
});
