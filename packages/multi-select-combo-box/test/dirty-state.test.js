import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-multi-select-combo-box.js';
import { getAllItems } from './helpers.js';

describe('dirty state', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    comboBox.items = ['Item 1', 'Item 2', 'Item 3'];
  });

  it('should not be dirty by default', () => {
    expect(comboBox.dirty).to.be.false;
  });

  it('should not be dirty after blur without change', () => {
    comboBox.focus();
    comboBox.blur();
    expect(comboBox.dirty).to.be.false;
  });

  it('should not be dirty after pressing Enter without change', async () => {
    comboBox.focus();
    await sendKeys({ press: 'Enter' });
    expect(comboBox.dirty).to.be.false;
  });

  it('should not be dirty after closing the dropdown without change', async () => {
    comboBox.focus();
    comboBox.click();
    outsideClick();
    expect(comboBox.dirty).to.be.false;
  });

  it('should not be dirty after cancelling selection and closing the dropdown', async () => {
    comboBox.focus();
    comboBox.click();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Escape' });
    await sendKeys({ press: 'Escape' });
    expect(comboBox.dirty).to.be.false;
  });

  it('should be dirty after user input', async () => {
    comboBox.focus();
    await sendKeys({ press: 'I' });
    expect(comboBox.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with click', () => {
    comboBox.focus();
    comboBox.click();
    getAllItems(comboBox)[0].click();
    expect(comboBox.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with Enter', async () => {
    comboBox.focus();
    comboBox.click();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });
    expect(comboBox.dirty).to.be.true;
  });

  it('should be dirty after clear button click', () => {
    comboBox.clearButtonVisible = true;
    comboBox.value = 'foo';
    comboBox.$.clearButton.click();
    expect(comboBox.dirty).to.be.true;
  });
});
