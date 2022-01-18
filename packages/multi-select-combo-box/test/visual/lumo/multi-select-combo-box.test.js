import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../common.js';
import '../../../theme/lumo/vaadin-multi-select-combo-box.js';
import '../../not-animated-styles.js';

describe('multi-select-combo-box', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>', div);
    element.items = ['Apple', 'Banana', 'Lemon', 'Orange'];
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('focus-ring', async () => {
    await sendKeys({ press: 'Tab' });

    await visualDiff(div, 'focus-ring');
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
    element.allowCustomValues = true;
    element.selectedItems = ['Pineapple'];
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
      element.selectedItems = ['Apple', 'Lemon'];
    });

    it('default', async () => {
      await visualDiff(div, 'selected');
    });

    it('placeholder', async () => {
      element.placeholder = 'Placeholder';
      await visualDiff(div, 'selected-placeholder');
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

    it('multi-line', async () => {
      element.style.maxWidth = '300px';
      element.selectedItems = ['Apple', 'Banana', 'Lemon', 'Orange'];
      await visualDiff(div, 'selected-multi-line');
    });
  });

  describe('compact mode', () => {
    beforeEach(() => {
      element.selectedItems = ['Apple', 'Lemon'];
      element.compactMode = true;
    });

    it('default', async () => {
      await visualDiff(div, 'compact-mode-default');
    });

    it('placeholder', async () => {
      element.selectedItems = [];
      element.placeholder = 'Placeholder';
      await visualDiff(div, 'compact-mode-placeholder');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'compact-mode-readonly');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'compact-mode-disabled');
    });
  });

  describe('opened', () => {
    beforeEach(() => {
      div.style.height = '200px';
      element.$.comboBox.click();
    });

    it('opened', async () => {
      await visualDiff(div, 'opened');
    });

    it('opened selected', async () => {
      element.selectedItems = ['Apple', 'Lemon'];
      await visualDiff(div, 'opened-selected');
    });
  });
});
