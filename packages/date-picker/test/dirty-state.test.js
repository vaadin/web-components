import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextRender, outsideClick, tap } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-date-picker.js';
import { getFocusedCell, waitForOverlayRender, waitForScrollToFinish } from './helpers.js';

describe('dirty state', () => {
  let datePicker;

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker></vaadin-date-picker>');
    await nextRender();
  });

  it('should not be dirty by default', () => {
    expect(datePicker.dirty).to.be.false;
  });

  it('should not be dirty after blur without change', () => {
    datePicker.focus();
    datePicker.blur();
    expect(datePicker.dirty).to.be.false;
  });

  it('should not be dirty after outside click without change', async () => {
    datePicker.focus();
    datePicker.click();
    outsideClick();
    expect(datePicker.dirty).to.be.false;
  });

  it('should not be dirty after pressing Enter without change', async () => {
    datePicker.focus();
    await sendKeys({ press: 'Enter' });
    expect(datePicker.dirty).to.be.false;
  });

  it('should not be dirty after cancelling selection and closing the dropdown', async () => {
    datePicker.focus();
    datePicker.click();
    await waitForOverlayRender();
    await sendKeys({ press: 'ArrowDown' });
    await waitForScrollToFinish(datePicker._overlayContent);
    await sendKeys({ press: 'Escape' });
    expect(datePicker.dirty).to.be.false;
  });

  it('should be dirty after user input', async () => {
    datePicker.focus();
    await sendKeys({ type: '1' });
    expect(datePicker.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with click', async () => {
    datePicker.focus();
    datePicker.click();
    await waitForOverlayRender();
    const date = getFocusedCell(datePicker._overlayContent);
    tap(date);
    expect(datePicker.dirty).to.be.true;
  });

  it('should be dirty after selecting a dropdown item with Enter', async () => {
    datePicker.focus();
    datePicker.click();
    await waitForOverlayRender();
    await sendKeys({ press: 'ArrowDown' });
    await waitForScrollToFinish(datePicker._overlayContent);
    await sendKeys({ press: 'Enter' });
    expect(datePicker.dirty).to.be.true;
  });

  it('should be dirty after clear button click', () => {
    datePicker.clearButtonVisible = true;
    datePicker.value = '2023-01-01';
    datePicker.$.clearButton.click();
    expect(datePicker.dirty).to.be.true;
  });
});
