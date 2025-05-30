import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../vaadin-checkbox-group.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-checkbox-group', () => {
  let group;

  beforeEach(async () => {
    resetUniqueId();
    group = fixtureSync(`
      <vaadin-checkbox-group>
        <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
        <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
      </vaadin-checkbox-group>
    `);
    await nextUpdate(group);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(group).dom.to.equalSnapshot();
    });

    it('label', async () => {
      group.label = 'Label';
      await nextUpdate(group);
      await expect(group).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      group.disabled = true;
      await expect(group).dom.to.equalSnapshot();
    });

    it('readonly', async () => {
      group.readonly = true;
      await nextUpdate(group);
      await expect(group).dom.to.equalSnapshot();
    });

    it('required', async () => {
      group.required = true;
      await expect(group).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      group.helperText = 'Helper';
      await nextUpdate(group);
      await expect(group).dom.to.equalSnapshot();
    });

    it('error', async () => {
      group.errorMessage = 'Error';
      group.invalid = true;
      await aTimeout(0);
      await expect(group).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(group).shadowDom.to.equalSnapshot();
    });
  });
});
