import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-switch.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { Switch } from '../../vaadin-switch.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.switchComponent = true;

describe('vaadin-switch', () => {
  let element: Switch;

  beforeEach(async () => {
    resetUniqueId();
    element = fixtureSync('<vaadin-switch></vaadin-switch>');
    await nextUpdate(element);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(element).dom.to.equalSnapshot();
    });

    it('checked', async () => {
      element.checked = true;
      await nextUpdate(element);
      await expect(element).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      element.disabled = true;
      await nextUpdate(element);
      await expect(element).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      element.readonly = true;
      await nextUpdate(element);
      await expect(element).dom.to.equalSnapshot();
    });

    it('invalid', async () => {
      element.errorMessage = 'Error';
      element.invalid = true;
      await aTimeout(0);
      await expect(element).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(element).shadowDom.to.equalSnapshot();
    });
  });
});
