import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-text-area.js';

describe('vaadin-text-area', () => {
  let textArea;

  beforeEach(async () => {
    textArea = fixtureSync('<vaadin-text-area label="Comment"></vaadin-text-area>');
    await nextUpdate(textArea);
  });

  it('default', async () => {
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('value', async () => {
    textArea.value = 'Line 1\nLine 2';
    await nextUpdate(textArea);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('placeholder', async () => {
    textArea.placeholder = 'Type here';
    await nextUpdate(textArea);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('disabled', async () => {
    textArea.disabled = true;
    await nextUpdate(textArea);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('readonly', async () => {
    textArea.readonly = true;
    await nextUpdate(textArea);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('required', async () => {
    textArea.required = true;
    await nextUpdate(textArea);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('helper', async () => {
    textArea.helperText = 'Helper text';
    await nextUpdate(textArea);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });

  it('error', async () => {
    textArea.errorMessage = 'Error message';
    textArea.invalid = true;
    await aTimeout(0);
    await expect(textArea).to.equalAriaSnapshot();
    await expect(textArea).to.be.accessible();
  });
});
