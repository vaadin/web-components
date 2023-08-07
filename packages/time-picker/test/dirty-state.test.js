import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-lit-time-picker.js';
import { getAllItems } from './helpers.js';

describe('dirty state', () => {
  let timePicker;

  beforeEach(async () => {
    timePicker = fixtureSync('<vaadin-time-picker></vaadin-time-picker>');
    await nextRender();
  });

  it('should not be dirty by default', () => {
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after blur without change', async () => {
    timePicker.focus();
    timePicker.blur();
    await nextUpdate(timePicker);
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after outside click without change', async () => {
    timePicker.focus();
    timePicker.click();
    outsideClick();
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after pressing Enter without change', async () => {
    timePicker.focus();
    await sendKeys({ press: 'Enter' });
    expect(timePicker.dirty).to.be.false;
  });

  it('should not be dirty after cancelling selection and closing the dropdown', async () => {
    timePicker.focus();
    timePicker.click();
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Escape' });
    await sendKeys({ press: 'Escape' });
    expect(timePicker.dirty).to.be.false;
  });

  it('should be dirty after user input', async () => {
    timePicker.focus();
    await sendKeys({ type: '1' });
    expect(timePicker.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with click', () => {
    timePicker.focus();
    timePicker.click();
    getAllItems(timePicker)[0].click();
    expect(timePicker.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with Enter', async () => {
    timePicker.focus();
    timePicker.click();
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
