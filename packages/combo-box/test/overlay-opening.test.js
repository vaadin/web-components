import { expect } from '@vaadin/chai-plugins';
import { arrowDownKeyDown, arrowUpKeyDown, click, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { setInputValue } from './helpers.js';

describe('overlay opening', () => {
  let comboBox, overlay, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box label="Label"></vaadin-combo-box>');
    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
    input = comboBox.inputElement;
    overlay = comboBox.$.overlay;
  });

  describe('default (auto open)', () => {
    it('should set opened to false by default', () => {
      expect(comboBox.opened).to.be.false;
    });

    it('should open by clicking label element', () => {
      comboBox.querySelector('[slot="label"]').click();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clicking input element', () => {
      input.click();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clicking toggle button', () => {
      comboBox._toggleElement.click();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by entering input value', () => {
      setInputValue(comboBox, 'foo');

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clearing input value', () => {
      comboBox.value = 'foo';
      expect(comboBox.opened).to.be.false;

      setInputValue(comboBox, '');

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open with Arrow Down key', () => {
      arrowDownKeyDown(input);

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open with Arrow Up key', () => {
      arrowUpKeyDown(input);

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open on function call', () => {
      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should prevent default for the handled label element click', () => {
      const event = click(comboBox.querySelector('[slot="label"]'));
      expect(event.defaultPrevented).to.be.true;
    });

    it('should prevent default for the handled toggle button click', () => {
      const event = click(comboBox._toggleElement);
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('auto open disabled', () => {
    beforeEach(() => {
      comboBox.autoOpenDisabled = true;
    });

    it('should not open by clicking label element when autoOpenDisabled is true', () => {
      comboBox.querySelector('[slot="label"]').click();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open by clicking input element when autoOpenDisabled is true', () => {
      input.click();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open by entering input value when autoOpenDisabled is true', () => {
      setInputValue(comboBox, 'foo');

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open by clearing input value when autoOpenDisabled is true', () => {
      comboBox.value = 'foo';
      expect(comboBox.opened).to.be.false;

      setInputValue(comboBox, '');

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should open by clicking toggle button when autoOpenDisabled is true', () => {
      comboBox._toggleElement.click();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should not prevent default for label click when autoOpenDisabled', () => {
      const event = click(comboBox.querySelector('[slot="label"]'));
      expect(event.defaultPrevented).to.be.false;
    });
  });

  describe('opening disallowed', () => {
    it('should not open on helper element click', async () => {
      comboBox.helperText = 'Helper Text';
      await nextUpdate(comboBox);
      comboBox.querySelector('[slot=helper]').click();

      expect(comboBox.opened).to.be.false;
    });

    it('should not open on error message element click', () => {
      comboBox.invalid = true;
      comboBox.errorMessage = 'Error message';

      comboBox.querySelector('[slot=error-message]').click();

      expect(comboBox.opened).to.be.false;
    });

    it('should not open overlay when disabled is set to true', () => {
      comboBox.disabled = true;
      comboBox.open();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when readonly is set to true', () => {
      comboBox.readonly = true;
      comboBox.open();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when setting items to null', () => {
      comboBox.items = null;

      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when setting empty items array', () => {
      comboBox.items = [];

      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when setting empty filteredItems array', () => {
      comboBox.filteredItems = [];

      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });
  });
});
