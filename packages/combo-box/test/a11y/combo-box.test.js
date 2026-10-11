import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-combo-box.js';

describe('vaadin-combo-box', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box label="Country"></vaadin-combo-box>');
    comboBox.items = ['Finland', 'Germany', 'Sweden'];
    await nextUpdate(comboBox);
  });

  it('default', async () => {
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('value', async () => {
    comboBox.value = 'Germany';
    await nextUpdate(comboBox);
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('placeholder', async () => {
    comboBox.placeholder = 'Choose a country';
    await nextUpdate(comboBox);
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('disabled', async () => {
    comboBox.disabled = true;
    await nextUpdate(comboBox);
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('readonly', async () => {
    comboBox.readonly = true;
    await nextUpdate(comboBox);
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('required', async () => {
    comboBox.required = true;
    await nextUpdate(comboBox);
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('error', async () => {
    comboBox.errorMessage = 'Error message';
    comboBox.invalid = true;
    await aTimeout(0);
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });

  it('opened', async () => {
    comboBox.value = 'Germany';
    comboBox.open();
    await oneEvent(comboBox.$.overlay, 'vaadin-overlay-open');
    await expect(comboBox).to.equalAriaSnapshot();
    await expect(comboBox).to.be.accessible();
  });
});
