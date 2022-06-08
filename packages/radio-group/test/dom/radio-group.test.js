import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-radio-group.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-radio-group', () => {
  let group;

  beforeEach(() => {
    resetUniqueId();
    group = fixtureSync(`
      <vaadin-radio-group>
        <vaadin-radio-button value="1" label="Radio 1"></vaadin-radio-button>
        <vaadin-radio-button value="2" label="Radio 2"></vaadin-radio-button>
      </vaadin-radio-group>
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
