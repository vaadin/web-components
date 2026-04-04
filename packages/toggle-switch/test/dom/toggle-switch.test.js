import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-toggle-switch.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-toggle-switch', () => {
  let toggle;

  beforeEach(() => {
    resetUniqueId();
    toggle = fixtureSync('<vaadin-toggle-switch></vaadin-toggle-switch>');
  });

  describe('host', () => {
    it('default', async () => {
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('name', async () => {
      toggle.name = 'Name';
      await nextUpdate(toggle);
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('label', async () => {
      toggle.label = 'Label';
      await nextUpdate(toggle);
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      toggle.disabled = true;
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      toggle.readonly = true;
      await nextUpdate(toggle);
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      toggle.helperText = 'Helper';
      await nextUpdate(toggle);
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('required', async () => {
      toggle.required = true;
      await expect(toggle).dom.to.equalSnapshot();
    });

    it('error', async () => {
      toggle.errorMessage = 'Error';
      toggle.invalid = true;
      await aTimeout(0);
      await expect(toggle).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(toggle).shadowDom.to.equalSnapshot();
    });
  });
});
