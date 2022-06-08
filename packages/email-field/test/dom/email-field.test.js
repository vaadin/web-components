import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-email-field.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

describe('vaadin-email-field', () => {
  let field;

  // Ignore pattern because of escape characters
  const SNAPSHOT_CONFIG = {
    ignoreAttributes: ['pattern'],
  };

  beforeEach(() => {
    resetUniqueId();
    field = fixtureSync('<vaadin-email-field></vaadin-email-field>');
  });

  describe('shadow', () => {
    it('default', async () => {
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('disabled', async () => {
      field.disabled = true;
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('readonly', async () => {
      field.readonly = true;
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('invalid', async () => {
      field.invalid = true;
      await expect(field).shadowDom.to.equalSnapshot();
    });

    it('theme', async () => {
      field.setAttribute('theme', 'align-right');
      await expect(field).shadowDom.to.equalSnapshot();
    });
  });

  describe('slots', () => {
    it('default', async () => {
      await expect(field).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });

    it('helper', async () => {
      field.helperText = 'Helper';
      await expect(field).lightDom.to.equalSnapshot(SNAPSHOT_CONFIG);
    });
  });
});
