import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-checkbox-group.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-checkbox-group', () => {
  let group;

  beforeEach(() => {
    resetUniqueId();
    group = fixtureSync(`
      <vaadin-checkbox-group>
        <vaadin-checkbox value="1" label="Checkbox 1"></vaadin-checkbox>
        <vaadin-checkbox value="2" label="Checkbox 2"></vaadin-checkbox>
      </vaadin-checkbox-group>
    `);
  });

  describe('host', () => {
    it('default', async () => {
      await expect(group).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      group.disabled = true;
      await expect(group).dom.to.equalSnapshot();
    });
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(group).shadowDom.to.equalSnapshot();
    });
  });
});
