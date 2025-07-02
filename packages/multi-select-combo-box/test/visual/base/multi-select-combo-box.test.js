import { resetMouse, sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../src/vaadin-multi-select-combo-box.js';

describe('multi-select-combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>', div);
    element.items = ['Apple', 'Banana', 'Lemon', 'Pear'];
  });

  afterEach(() => {
    // After tests which use sendKeys() the focus-utils.js -> isKeyboardActive is set to true.
    // Click once here on body to reset it so other tests are not affected by it.
    // An unwanted focus-ring would be shown in other tests otherwise.
    mousedown(document.body);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('readonly', async () => {
    element.readonly = true;
    await visualDiff(div, 'readonly');
  });

  it('label', async () => {
    element.label = 'Label';
    await visualDiff(div, 'label');
  });

  it('placeholder', async () => {
    element.placeholder = 'Placeholder';
    await visualDiff(div, 'placeholder');
  });

  it('custom value', async () => {
    element.allowCustomValue = true;
    element.selectedItems = ['Orange'];
    await visualDiff(div, 'custom-value');
  });

  it('required', async () => {
    element.label = 'Label';
    element.required = true;
    await visualDiff(div, 'required');
  });

  it('error message', async () => {
    element.label = 'Label';
    element.errorMessage = 'This field is required';
    element.required = true;
    element.validate();
    await visualDiff(div, 'error-message');
  });

  it('helper text', async () => {
    element.helperText = 'Helper text';
    await visualDiff(div, 'helper-text');
  });

  describe('selected items', () => {
    beforeEach(() => {
      element.style.width = '250px';
      element.selectedItems = ['Apple', 'Banana'];
    });

    it('default', async () => {
      await visualDiff(div, 'selected');
    });

    it('overflow 2', async () => {
      element.selectedItems = ['Apple', 'Banana', 'Lemon'];
      await visualDiff(div, 'selected-overflow-2');
    });

    it('overflow 3', async () => {
      element.selectedItems = ['Apple', 'Banana', 'Lemon', 'Pear'];
      await visualDiff(div, 'selected-overflow-3');
    });

    it('clear button', async () => {
      element.clearButtonVisible = true;
      await visualDiff(div, 'selected-clear-button');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'selected-readonly');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'selected-disabled');
    });

    it('focused chip', async () => {
      element.inputElement.focus();
      await sendKeys({ press: 'ArrowLeft' });
      await visualDiff(div, 'selected-focused-chip');
    });
  });

  describe('auto expand', () => {
    beforeEach(() => {
      element.selectedItems = [...element.items];
      element.autoExpandHorizontally = true;
      element.autoExpandVertically = true;
    });

    it('auto expand', async () => {
      await visualDiff(div, 'auto-expand');
    });

    it('auto expand max width', async () => {
      element.style.maxWidth = '250px';
      await visualDiff(div, 'auto-expand-max-width');
    });

    it('auto expand height', async () => {
      element.label = 'Label';
      element.style.width = '300px';
      element.style.height = '200px';
      const items = Array.from({ length: 20 }).map((_, i) => `Item ${i}`);
      element.items = items;
      element.selectedItems = items;
      await visualDiff(div, 'auto-expand-height');
    });

    it('auto expand long chip', async () => {
      element.style.maxWidth = '300px';
      const items = [...element.items];
      items[0] = 'Super long item that does not fit into input';
      element.items = element.selectedItems = [items[0]];
      await visualDiff(div, 'auto-expand-long-chip');
    });

    it('auto expand long chip clear button', async () => {
      element.style.maxWidth = '300px';
      element.clearButtonVisible = true;
      const items = [...element.items];
      items[0] = 'Super long item that does not fit into input';
      element.items = element.selectedItems = [items[0]];
      await visualDiff(div, 'auto-expand-long-chip-clear-button');
    });
  });

  describe('opened', () => {
    beforeEach(() => {
      div.style.height = '200px';
    });

    it('opened', async () => {
      element.$.comboBox.click();
      await visualDiff(div, 'opened');
    });

    it('opened selected', async () => {
      element.style.width = '250px';
      element.selectedItems = ['Apple', 'Banana'];
      element.$.comboBox.click();
      await visualDiff(div, 'opened-selected');
    });

    it('opened readonly', async () => {
      element.selectedItems = ['Apple', 'Banana'];
      element.readonly = true;
      element.$.comboBox.click();
      await visualDiff(div, 'opened-readonly');
    });
  });

  describe('focus', () => {
    beforeEach(() => {
      element.autoOpenDisabled = true;
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('keyboard focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'keyboard-focus-ring');
    });
  });
});
