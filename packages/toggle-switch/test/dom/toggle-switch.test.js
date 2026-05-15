import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-toggle-switch.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.toggleSwitchComponent = true;

describe('vaadin-toggle-switch', () => {
  let toggleSwitch;

  beforeEach(async () => {
    resetUniqueId();
    toggleSwitch = fixtureSync('<vaadin-toggle-switch></vaadin-toggle-switch>');
    await nextUpdate(toggleSwitch);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(toggleSwitch).dom.to.equalSnapshot();
    });

    it('checked', async () => {
      toggleSwitch.checked = true;
      await nextUpdate(toggleSwitch);
      await expect(toggleSwitch).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      toggleSwitch.disabled = true;
      await nextUpdate(toggleSwitch);
      await expect(toggleSwitch).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      toggleSwitch.readonly = true;
      await nextUpdate(toggleSwitch);
      await expect(toggleSwitch).dom.to.equalSnapshot();
    });

    it('invalid', async () => {
      toggleSwitch.errorMessage = 'Error';
      toggleSwitch.invalid = true;
      await aTimeout(0);
      await expect(toggleSwitch).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(toggleSwitch).shadowDom.to.equalSnapshot();
    });
  });
});
