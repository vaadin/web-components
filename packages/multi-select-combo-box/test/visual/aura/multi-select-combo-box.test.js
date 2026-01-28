import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
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
});
