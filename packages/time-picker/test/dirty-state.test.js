import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-time-picker.js';
import { getAllItems } from './helpers.js';

describe('dirty state', () => {
  let timePicker, input;

  beforeEach(() => {
    timePicker = fixtureSync('<vaadin-time-picker></vaadin-time-picker>');
    input = timePicker.inputElement;
  });

  it('should not be dirty by default', () => {
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after blur without change', () => {
    input.focus();
    input.blur();
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after outside click without change', async () => {
    input.focus();
    input.click();
    outsideClick();
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after pressing Enter without change', async () => {
    input.focus();
    await sendKeys({ press: 'Enter' });
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after cancelling selection and closing the dropdown', async () => {
    input.focus();
    input.click();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Escape' });
    await sendKeys({ press: 'Escape' });
    expect(timePicker.dirty).to.be.false;
  });

  it('should be dirty after user input', () => {
    fire(input, 'input');
    expect(timePicker.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with click', () => {
    input.focus();
    input.click();
    getAllItems(timePicker)[0].click();
    expect(timePicker.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with Enter', async () => {
    input.focus();
    input.click();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Enter' });
    expect(timePicker.dirty).to.be.true;
  });

  it('should be dirty after clear button click', () => {
    timePicker.clearButtonVisible = true;
    timePicker.value = '12:00';
    timePicker.$.clearButton.click();
    expect(timePicker.dirty).to.be.true;
  });
});
