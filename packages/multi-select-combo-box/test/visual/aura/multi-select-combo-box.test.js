import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../not-animated-styles.css';
import '../../../vaadin-multi-select-combo-box.js';

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

  it('label aside', async () => {
    element.setAttribute('theme', 'label-aside');
    element.label = 'Label';
    await visualDiff(div, 'label-aside');
  });

  describe('selected items', () => {
    beforeEach(() => {
      element.style.width = '250px';
      element.selectedItems = ['Apple', 'Banana'];
    });

    it('default', async () => {
      await visualDiff(div, 'selected');
    });

    it('readonly', async () => {
      element.readonly = true;
      await visualDiff(div, 'selected-readonly');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'selected-disabled');
    });
  });

  describe('opened', () => {
    beforeEach(() => {
      div.style.height = '200px';
    });

    it('opened', async () => {
      element.inputElement.click();
      await visualDiff(div, 'opened');
    });

    it('opened selected', async () => {
      element.style.width = '250px';
      element.selectedItems = ['Apple', 'Banana'];
      element.inputElement.click();
      await visualDiff(div, 'opened-selected');
    });

    it('opened readonly', async () => {
      element.selectedItems = ['Apple', 'Banana'];
      element.readonly = true;
      element.inputElement.click();
      await visualDiff(div, 'opened-readonly');
    });
  });

  describe('select all', () => {
    beforeEach(() => {
      div.style.height = '250px';
      element.selectAllButtonVisible = true;
      element.selectedItems = ['Apple'];
    });

    it('select all', async () => {
      element.inputElement.click();
      await visualDiff(div, 'select-all');
    });

    it('select all focus-ring', async () => {
      element.inputElement.focus();
      element.inputElement.click();
      await sendKeys({ press: 'ArrowDown' });
      await visualDiff(div, 'select-all-focus-ring');
    });

    it('select all truncated label', async () => {
      element.style.width = '200px';
      element.i18n = { selectAll: 'Select all of the available items' };
      element.inputElement.click();
      await visualDiff(div, 'select-all-truncated-label');
    });
  });
});
