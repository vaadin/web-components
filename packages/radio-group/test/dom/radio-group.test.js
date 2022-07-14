import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../../vaadin-radio-group.js';

describe('vaadin-radio-group', () => {
  let group;

  beforeEach(() => {
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

    it('label', async () => {
      group.label = 'Label';
      await expect(group).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      group.disabled = true;
      await expect(group).dom.to.equalSnapshot();
    });

    it('required', async () => {
      group.required = true;
      await expect(group).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      group.helperText = 'Helper';
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
