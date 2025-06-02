import { expect } from '@vaadin/chai-plugins';
import { arrowDownKeyDown, arrowUpKeyDown, click, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-time-picker.js';
import { setInputValue } from './helpers.js';

describe('overlay opening', () => {
  let timePicker, overlay, input;

  beforeEach(async () => {
    timePicker = fixtureSync('<vaadin-time-picker label="Label"></vaadin-time-picker>');
    await nextRender();
    input = timePicker.inputElement;
    overlay = timePicker.$.overlay;
  });

  describe('default (auto open)', () => {
    it('should set opened to false by default', () => {
      expect(timePicker.opened).to.be.false;
    });

    it('should open by clicking label element', () => {
      timePicker.querySelector('[slot="label"]').click();

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clicking input element', () => {
      input.click();

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clicking toggle button', () => {
      timePicker._toggleElement.click();

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by entering input value', () => {
      setInputValue(timePicker, '10:00');

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clearing input value', () => {
      timePicker.value = '10:00';
      expect(timePicker.opened).to.be.false;

      setInputValue(timePicker, '');

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open with Arrow Down key', () => {
      arrowDownKeyDown(input);

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open with Arrow Up key', () => {
      arrowUpKeyDown(input);

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open on function call', () => {
      timePicker.open();

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should prevent default for the handled label element click', () => {
      const event = click(timePicker.querySelector('[slot="label"]'));
      expect(event.defaultPrevented).to.be.true;
    });

    it('should prevent default for the handled toggle button click', () => {
      const event = click(timePicker._toggleElement);
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      timePicker.autoOpenDisabled = true;
    });

    it('should not open by clicking label element when autoOpenDisabled is true', () => {
      timePicker.querySelector('[slot="label"]').click();

      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open by clicking input element when autoOpenDisabled is true', () => {
      input.click();

      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open by entering input value when autoOpenDisabled is true', () => {
      setInputValue(timePicker, 'foo');

      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open by clearing input value when autoOpenDisabled is true', () => {
      timePicker.value = 'foo';
      expect(timePicker.opened).to.be.false;

      setInputValue(timePicker, '');

      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should open by clicking toggle button when autoOpenDisabled is true', () => {
      timePicker._toggleElement.click();

      expect(timePicker.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should not prevent default for label click when autoOpenDisabled', () => {
      const event = click(timePicker.querySelector('[slot="label"]'));
      expect(event.defaultPrevented).to.be.false;
    });
  });

  describe('opening disallowed', () => {
    it('should not open on helper element click', async () => {
      timePicker.helperText = 'Helper Text';
      await nextUpdate(timePicker);
      timePicker.querySelector('[slot=helper]').click();

      expect(timePicker.opened).to.be.false;
    });

    it('should not open on error message element click', () => {
      timePicker.invalid = true;
      timePicker.errorMessage = 'Error message';

      timePicker.querySelector('[slot=error-message]').click();

      expect(timePicker.opened).to.be.false;
    });

    it('should not open overlay when disabled is set to true', () => {
      timePicker.disabled = true;
      timePicker.open();

      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when readonly is set to true', () => {
      timePicker.readonly = true;
      timePicker.open();

      expect(timePicker.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });
  });
});
