import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-switch.js';

describe('vaadin-switch', () => {
  let element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-switch label="Notifications"></vaadin-switch>');
    await nextUpdate(element);
  });

  it('default', async () => {
    await expect(element).to.equalA11yTreeSnapshot();
    await expect(element).to.be.accessible();
  });

  it('checked', async () => {
    element.checked = true;
    await nextUpdate(element);
    await expect(element).to.equalA11yTreeSnapshot();
    await expect(element).to.be.accessible();
  });

  it('disabled', async () => {
    element.disabled = true;
    await nextUpdate(element);
    await expect(element).to.equalA11yTreeSnapshot();
    await expect(element).to.be.accessible();
  });

  it('readonly', async () => {
    element.readonly = true;
    await nextUpdate(element);
    await expect(element).to.equalA11yTreeSnapshot();
    await expect(element).to.be.accessible();
  });

  it('error', async () => {
    element.errorMessage = 'Notifications must be enabled';
    element.invalid = true;
    await aTimeout(0);
    await expect(element).to.equalA11yTreeSnapshot();
    await expect(element).to.be.accessible();
  });
});
