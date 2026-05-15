import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
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
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(toggleSwitch).shadowDom.to.equalSnapshot();
    });
  });
});
